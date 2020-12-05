const {map, keys, isEmpty} = _;
const protocol = 'http';
const address = 'localhost';
const port = 5000;

const api = async (hook, data = {}) => await $.get(`${protocol}://${address}:${port}/${hook}`, data);

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
    else alert(`Error!\n${res.error.detail || JSON.stringify(res.error, null, 2)}`);
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
    else alert(`Error!\n${res.error.detail || JSON.stringify(res.error, null, 2)}`);
  })
};
const onDelete = async (args) => {
  api('deleteItem', args).then(res => {
    if (res.status === 'OK') initializeTable(args);
    else alert(`Error!\n${res.error.detail || JSON.stringify(res.error, null, 2)}`);
  })
};

const toggleTable = (tableId) => {
  $(`#${tableId}`).toggle();
}
const initializeTable = (args) => {
  const {tableId, uniqueItemKey} = args;
  let {orderBy} = args;
  if (!orderBy) orderBy = uniqueItemKey;
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
      const generateEmptyTableItem = (item) => {
        let itemString = '';
        const actionsProperties = {tableId};

        map(keys(item), key => {
          itemString += `<td><input id="input-${key}-${tableId}_empty" placeholder="${translations[key] || key}"></td>`
        });

        const addButton = `<button onclick='onAdd(${JSON.stringify(actionsProperties)})'>Додати новий елемент</button>`;
        const actions = `<td>${addButton}</td>`
        return itemString + actions;
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
$(() => {
  updateTables();
  updateSellTable();
})

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

const sellTicket = () => {
  const privilege = $('#reduced-price').val();

  const {route_id, price, free_number_of_seats} = selectedRoute;

  const addTicketData = {
    tableId: 'ticket_info',
    fields: {
      date_of_sale: moment().format('DD/MM/YYYY'),
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
  Promise.all([
    api('addItem', addTicketData),
    api('editItem', editRouteData),
  ]).then(() => {
    updateTables();
    updateSellTable();
  })
}
