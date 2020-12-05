const {get} = $;
const {map, keys, isEmpty} = _;
const protocol = 'http';
const address = 'localhost';
const port = 5000;

const api = async (hook, data = {}) => await get(`${protocol}://${address}:${port}/${hook}`, data)
  .then(res => {
    if (res.status !== 'OK' && res.error)
      alert(`Error!\n${res.error.detail || JSON.stringify(res.error, null, 2)}`);
    else return res;
  })

const onAdd = async (args) => {
  const {tableId} = args;

  const inputs = $(`[id*='-${tableId}_empty`);
  const fields = {};
  for (let input of inputs) {
    const key = $(input).attr('id').split('-')[1];
    const value = $(input).val();

    if (isEmpty(value)) return;
    fields[key] = value;
  }

  api('addItem', {...args, fields}).then(res => {
    if (res.status === 'OK') initializeTable(args);
  })
};
const onEdit = async (args) => {
  const {tableId, uniqueItemKey, uniqueItemValue} = args;

  const inputs = $(`[id$='-${tableId}-${uniqueItemValue}']`);
  const fields = {};
  map(inputs, input => {
    const key = $(input).attr('id').split('-')[1];
    let value = $(input).val();
    if ($(input).attr('type') === 'date') {
      value = new Date(value);
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();
      value = [day, month, year].join('/');
    }
    fields[key] = value;
  })

  delete fields[uniqueItemKey];

  api('editItem', {...args, fields}).then(res => {
    if (res.status === 'OK') initializeTable(args);
  })
};
const onDelete = async (args) => {
  api('deleteItem', args).then(res => {
    if (res.status === 'OK') initializeTable(args);
  })
};

const toggleTable = (tableId) => {
  $(`#${tableId}`).toggle();
}
const initializeTable = (args) => {
  const {tableId, uniqueItemKey} = args;
  let {orderBy} = args;
  api('getRows', {tableId, orderBy})
    .then(res => {
      let head = [];
      let body = [];

      const generateHeadElement = (item) => {
        const options = JSON.stringify({
          tableId,
          uniqueItemKey,
          orderBy: item
        });
        return `<th class="${item === orderBy ? 'active' : ''}" onclick='initializeTable(${options})'>${translations[item] || item}</th>`;
      }
      const generateTableElement = (item) => {
        let itemString = '';
        const actionsProperties = {
          tableId,
          uniqueItemKey,
          uniqueItemValue: item[uniqueItemKey]
        }

        map(keys(item), key => {
          let value = item[key];

          let type = 'text';
          switch (typeof value) {
            case 'number':
              type = 'number';
              break;
            case 'string':
              const dateFormat = `${moment.HTML5_FMT.DATETIME_LOCAL_MS}[Z]`;
              if (moment(value, dateFormat).format(dateFormat) === value) {
                type = 'date';
                value = moment(value).format('YYYY-MM-DD');
                break;
              }
          }

          itemString += `<td><input ${key === uniqueItemKey && 'disabled'} type="${type}" id="input-${key}-${tableId}-${item[uniqueItemKey]}" value="${value}"></td>`
        });

        const saveButton = `<button onclick='onEdit(${JSON.stringify(actionsProperties)})'>Зберегти</button>`;
        const deleteButton = `<button onclick='onDelete(${JSON.stringify(actionsProperties)})'>Х</button>`;

        const actions = `<td>${saveButton}${deleteButton}</td>`

        return `<tr>${itemString + actions}</tr>`;
      };
      const generateEmptyTableItem = (item = res[0]) => {
        let itemString = '';
        const actionsProperties = {tableId};

        map(keys(item), key => {
          itemString += `<td><input id="input-${key}-${tableId}_empty" placeholder="${translations[key] || key}"></td>`
        });

        const addButton = `<button onclick='onAdd(${JSON.stringify(actionsProperties)})'>Додати новий елемент</button>`;
        const actions = `<td>${addButton}</td>`
        return `<tr>${itemString + actions}</tr>`;
      }

      map(keys(res[0]), key => head.push(generateHeadElement(key)));
      map(res, item => {
        body.push(generateTableElement(item))
      });
      body.push(generateEmptyTableItem(res[0]))

      head = `<thead><tr>${head.join()}<th>Дії з записами</th></tr></thead>`;
      body = `<tbody>${body.join()}</tbody>`;

      $(`#${tableId}`).html(head + body)
    })
    .catch((err) => alert(`Error!\n${err.message}`))
};

const tables = [
  {
    tableId: 'model',
    uniqueItemKey: 'bus_number',
  },
  {
    tableId: 'ticket_info',
    uniqueItemKey: 'ticket_id',
  },
  {
    tableId: 'route',
    uniqueItemKey: 'route_id',
  },
  {
    tableId: 'bus_info',
    uniqueItemKey: 'bus_id',
  },
  {
    tableId: 'route_info',
    uniqueItemKey: 'route_info_id',
  },
  {
    tableId: 'refunds',
    uniqueItemKey: 'refund_id',
  }
]
const updateTables = () => map(tables, table => initializeTable(table));

let availableRoutes, selectedRoute;

const updateSellTable = async () => {
  if (isEmpty(availableRoutes) || isEmpty(selectedRoute)) {
    const res = await api('getAvailableRoutes');

    if (isEmpty(availableRoutes))
      availableRoutes = res.sort((a, b) => a.route_id - b.route_id);

    if (!isEmpty(selectedRoute) && !!availableRoutes.find(route => route.route_id === selectedRoute.route_id)) {
      selectedRoute = {...availableRoutes.find(route => route.route_id === selectedRoute.route_id)};
    } else {
      selectedRoute = {...availableRoutes[0]};
    }
  }

  const table = $('#sell-ticket');
  let buffer = [];
  map(keys(selectedRoute), key => buffer.push(`<th>${translations[key] || key}</th>`))
  buffer.push(`<th>Знижка (%)</th><th></th>`)
  const head = `<thead><tr>${buffer.join()}</tr></thead>`;

  buffer = [];
  const subBuffer = [];
  map(availableRoutes, route => {
    const selected = route.route_id === selectedRoute.route_id ? 'selected' : '';
    subBuffer.push(`<option ${selected} value="${route.route_id}">${route.route_id}</option>`)
  })
  buffer.push(`<td><select id="available-routes-select">${subBuffer.join()}</select></td>`)
  map(keys(selectedRoute), key => {
    if (key !== 'route_id') {
      let value = selectedRoute[key];
      if (key === 'date_of_route') {
        value = moment(value).format('DD.MM.YYYY');
      }
      buffer.push(`<td>${value}</td>`)
    }
  })
  buffer.push(`<td><input id="reduced-price" placeholder="Знижка" type="number"></td>`)
  buffer.push(`<td><button onclick="sellTicket()">Продати квиток</button></td>`)
  const body = `<tbody><tr>${buffer.join()}</tr></tbody>`;
  table.html(head + body);
  $('#available-routes-select').on('change', (e) => {
    for (let route of availableRoutes) {
      if (route.route_id.toString() === e.target.value) {
        selectedRoute = route;
        updateSellTable();
        break;
      }
    }
  })
}
const sellTicket = async () => {
  const privilege = $('#reduced-price').val();

  const {route_id, price, free_number_of_seats} = selectedRoute;

  const addTicketData = {
    tableId: 'ticket_info',
    fields: {
      date_of_sale: moment().format('YYYY-MM-DD'),
      route_id: route_id,
      privilege: (privilege || 0) + '%',
      sum_for_ticket: price - (price * privilege * 0.01) || price,
    }
  }

  const editRouteData = {
    tableId: 'route',
    uniqueItemKey: 'route_id',
    uniqueItemValue: route_id,
    fields: {
      free_number_of_seats: free_number_of_seats - 1,
    }
  }

  availableRoutes = null;
  await api('addItem', addTicketData);
  await api('editItem', editRouteData);

  updateTables();
  updateSellTable();
}

let availableTickets, selectedTicket;
const updateReturnTable = async () => {
  if (isEmpty(availableTickets) || isEmpty(selectedTicket)) {
    const res = await api('getAvailableTickets');

    if (isEmpty(availableTickets))
      availableTickets = res.sort((a, b) => a.ticket_id - b.ticket_id);

    if (!isEmpty(selectedTicket) && !!availableTickets.find(ticket => ticket.ticket_id === selectedTicket.ticket_id)) {
      selectedTicket = {...availableTickets.find(ticket => ticket.ticket_id === selectedTicket.ticket_id)};
    } else {
      selectedTicket = {...availableTickets[0]};
    }
  }

  const table = $('#return-ticket');
  let buffer = [];
  map(keys(selectedTicket), key => buffer.push(`<th>${translations[key] || key}</th>`))
  buffer.push(`<th></th>`)
  const head = `<thead><tr>${buffer.join()}</tr></thead>`;

  buffer = [];
  const subBuffer = [];
  map(availableTickets, ticket => {
    const selected = ticket.ticket_id === selectedTicket.ticket_id ? 'selected' : '';
    const date = moment(ticket.date_of_sale).format('DD.MM.YYYY');
    subBuffer.push(`<option ${selected} value="${ticket.ticket_id}">${ticket.ticket_id}: ${date}, ${ticket.sum_for_ticket} UAH</option>`)
  })
  buffer.push(`<td><select id="available-tickets-select">${subBuffer.join()}</select></td>`)
  map(keys(selectedTicket), key => {
    if (key !== 'ticket_id') {
      let value = selectedTicket[key];
      if (key === 'date_of_sale') value = moment(value).format('DD.MM.YYYY');
      buffer.push(`<td>${value}</td>`)
    }
  })
  buffer.push(`<td><button onclick="returnTicket()">Повернути квиток</button></td>`)
  const body = `<tbody><tr>${buffer.join()}</tr></tbody>`;
  table.html(head + body);
  $('#available-tickets-select').on('change', (e) => {
    for (let ticket of availableTickets) {
      if (ticket.ticket_id.toString() === e.target.value) {
        selectedTicket = ticket;
        updateReturnTable();
        break;
      }
    }
  })
}
const returnTicket = async () => {
  const today = moment().format('YYYY-MM-DD');
  const {ticket_id, sum_for_ticket, date_of_route, route_id, free_number_of_seats} = selectedTicket;
  const isReturnedInAdvance = moment(today).isBefore(moment(date_of_route));

  const addRefundData = {
    tableId: 'refunds',
    fields: {
      ticket_id,
      date_of_return: today,
      sum_of_return: sum_for_ticket * (isReturnedInAdvance ? 0.6 : 0.1),
      refund_id: ticket_id,
    }
  }

  const editRouteData = {
    tableId: 'route',
    uniqueItemKey: 'route_id',
    uniqueItemValue: route_id,
    fields: {
      free_number_of_seats: isReturnedInAdvance ? free_number_of_seats + 1 : free_number_of_seats,
    }
  }

  availableRoutes = null;

  await api('addItem', addRefundData);
  await api('editItem', editRouteData);

  updateTables();
  updateReturnTable();
}

$(() => {
  Promise.resolve()
    .then(updateSellTable)
    .then(updateReturnTable)
    .then(updateTables)
  ;
})

const resetDatabase = () => {
  const confirm = window.confirm('Чи ти напевно хочеш перезавантажити БД?');
  if (confirm) {
    api('resetDatabase', {confirm}).then(() => {
      Promise.resolve()
        .then(updateSellTable)
        .then(updateReturnTable)
        .then(updateTables)
      ;
    })
  }
}
