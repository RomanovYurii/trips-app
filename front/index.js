const {isEmpty, map} = _;

const protocol = 'http';
const address = 'localhost';
const port = 5000;

const nothingWasFoundString = 'Не знайдено записів на поданий запит';

const api = async (hook, data = {}) => await $.get(`${protocol}://${address}:${port}/${hook}`, data);

const injectParsedRows = ({orderedKeys, items, destinationId}) => {
  const headers = map(orderedKeys, key => translations[key])
  if (!isEmpty(items)) {
    const rows = [];
    items.map(item => {
      const cells = [];
      orderedKeys.map(key => cells.push(`<td>${item[key]}</td>`))
      rows.push(`<tr>${cells.join('')}</tr>`)
    })
    $(destinationId).html(`
      <thead>
      <tr>
          <th>${headers.join('</th><th>')}</th>
      </tr>
      </thead>
      <tbody>
          ${rows.join('')}
      </tbody>
    `)
  } else {
    $(destinationId).html(`<tbody><tr><td>${nothingWasFoundString}</td></tr></tbody>`)
  }
}

api('getAveragePrice').then(res => {
  $('#avg').append(Number.parseInt(res, 0))
})

api('getMinPrices').then(res => {
  injectParsedRows({
    destinationId: '#table-min',
    orderedKeys: [
      'point_of_arrival',
      'min'
    ],
    items: res
  })
})

api('getNoTicketCases').then(res => {
  injectParsedRows({
    destinationId: '#table-no-ticket',
    orderedKeys: [
      'route_id',
      'free_number_of_seats',
      'number_of_seats'
    ],
    items: res
  })
})

const onSearchNextDay = () => {
  const destination = $('#input-next-day').val();
  if (!isEmpty(destination)) {
    api('getNextDayRoutes', {destination}).then(res => {
      injectParsedRows({
        destinationId: '#table-next-day',
        orderedKeys: [
          'route_id',
          'time_of_route',
          'price',
          'free_number_of_seats',
          'point_of_arrival',
          'brand',
          'bus_number'
        ],
        items: res
      })
    })
  }
}

api('getBusesSchedule').then(res => {
  injectParsedRows({
    destinationId: '#table-buses-schedule',
    orderedKeys: [
      'point_of_arrival',
      'date_of_route',
      'time_of_route',
      'distance',
    ],
    items: res,
  })
})
