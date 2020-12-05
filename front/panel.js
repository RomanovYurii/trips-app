const {map, keys, isEmpty} = _;
const port = 5000;

const api = async (hook, data = {}) => await $.get(`http://localhost:${port}/${hook}`, data);

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
        return `<th class="${item === orderBy ? 'active' : ''}" onclick='initializeTable(${options})'>${item}</th>`;
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

        const saveButton = `<button onclick='onEdit(${JSON.stringify(actionsProperties)})'>Save</button>`;
        const deleteButton = `<button onclick='onDelete(${JSON.stringify(actionsProperties)})'>X</button>`;

        const actions = `<td>${saveButton}${deleteButton}</td>`

        return `<tr>${itemString + actions}</tr>`;
      };
      const generateEmptyTableItem = (item) => {
        let itemString = '';
        const actionsProperties = {tableId};

        map(keys(item), key => {
          itemString += `<td><input id="input-${key}-${tableId}_empty" placeholder="${key}"></td>`
        });

        const addButton = `<button onclick='onAdd(${JSON.stringify(actionsProperties)})'>Add new</button>`;
        const actions = `<td>${addButton}</td>`
        return itemString + actions;
      }

      map(keys(res[0]), key => head.push(generateHeadElement(key)));
      map(res, item => {
        body.push(generateTableElement(item))
      });
      body.push(generateEmptyTableItem(res[0]))

      head = `<thead><tr>${head.join()}<th>Actions</th></tr></thead>`;
      body = `<tbody>${body.join()}</tbody>`;

      $(`#${tableId}`).html(head + body)
    })
    .catch((err) => alert(`Error!\n${err.message}`))
};

const tables = [
  {
    tableId: 'model',
    uniqueItemKey: 'bus_number',
  }, {
    tableId: 'ticket_info',
    uniqueItemKey: 'ticket_id',
  }, {
    tableId: 'route',
    uniqueItemKey: 'route_id',
  }, {
    tableId: 'bus_info',
    uniqueItemKey: 'bus_id',
  }, {
    tableId: 'route_info',
    uniqueItemKey: 'route_info_id',
  }, {
    tableId: 'refunds',
    uniqueItemKey: 'refund_id',
  }
]

$(() => {
  map(tables, table => initializeTable(table));
})

