const fs = require('fs');
const cors = require('cors')
const express = require('express')
const {Pool} = require('pg')

const connectionString = "postgres://postgres:password@localhost/trips"
const mockTables = fs.readFileSync(__dirname + '/sql/mock_tables.sql').toString();
const createTables = fs.readFileSync(__dirname + '/sql/create_tables.sql').toString();

const app = express()
const pool = new Pool({connectionString})

app.use(cors())

// Визначити середню вартість квитка по всім рейсам
const getAveragePrice = async () => {
  const dbRes = await pool.query('SELECT AVG(PRICE) FROM route;')
  return dbRes.rows[0].avg
}
// Для вибраного пункту призначення вибрати рейси на наступний день
const nextDayRoutes = async (destination) => {
  const dbRes = await pool.query(`
    select route.route_id, route.time_of_route, route.price, route.free_number_of_seats, route_info.point_of_arrival, bus_info.bus_number, bus_info.brand
    from route 
    join route_info on route.route_info_id=route_info.route_info_id
    join bus_info on route.bus=bus_info.bus_id
    where date_of_route=current_date-21 and route_info.point_of_arrival = '${destination}';
  `)

  return dbRes.rows
}
// Для кожного пункту призначення визначити найдешевший рейс із запланованих
const minPrices = async () => {
  const dbRes = await pool.query(`
    select min(price), route_info.point_of_arrival
    from route 
    join route_info on route.route_info_id = route_info.route_info_id
    where price is not null
    group by route_info.point_of_arrival;
  `)

  return dbRes.rows
}
// Визначити усі рейси, на які не було продано жодного квитка
const noTicketCase = async () => {
  const dbRes = await pool.query(`
    SELECT route.route_id, route.free_number_of_seats, model.number_of_seats
    from route
    join bus_info on route.bus=bus_info.bus_id
    join model on bus_info.bus_number=model.bus_number
    where route.free_number_of_seats=model.number_of_seats;
  `)

  return dbRes.rows
}
// Розклад руху автобусів впорядкованих за часом відправлення
const busesSchedule = async () => {
  const dbRes = await pool.query(`
    SELECT date_of_route, time_of_route, point_of_arrival, distance
    FROM route JOIN route_info ON route.route_info_id=route_info.route_info_id
  `)

  return dbRes.rows
}

// General
app.get('/getRows', async (req, res) => {
  const {tableId, orderBy} = req.query;
  let query = `SELECT * FROM ${tableId}`;
  if (orderBy) query += ` ORDER BY ${orderBy} ASC`;
  const {rows} = await pool.query(query)
  res.send(rows);
})
app.get('/deleteItem', async (req, res) => {
  const {tableId, uniqueItemKey, uniqueItemValue} = req.query;
  const query = `DELETE FROM ${tableId} WHERE ${uniqueItemKey}='${uniqueItemValue}'`;
  pool.query(query)
    .then(() => res.send({status: 'OK'}))
    .catch((error) => res.send({status: 'Error', error}))
})
app.get('/editItem', async (req, res) => {
  const {tableId, uniqueItemKey, uniqueItemValue, fields} = req.query;
  const set = [];
  Object.keys(fields).map(key => {
    set.push(`${key}='${fields[key]}'`)
  })
  const query = `
    UPDATE ${tableId}
    SET ${set.join(', ')}
    WHERE ${uniqueItemKey}='${uniqueItemValue}'
  `;

  pool.query(query)
    .then(() => res.send({status: 'OK'}))
    .catch((error) => res.send({status: 'Error', error}))
})
app.get('/addItem', async (req, res) => {
  const {tableId, fields} = req.query;

  const keys = Object.keys(fields);
  const values = Object.values(fields);

  const query = `
    INSERT INTO ${tableId} (${keys.join(', ')})
    VALUES  ('${values.join('\', \'')}')
  `;

  pool.query(query)
    .then(() => res.send({status: 'OK'}))
    .catch((error) => res.send({status: 'Error', error}))
})

// Tasks
app.get('/getAveragePrice', async (req, res) => {
  res.send(await getAveragePrice())
})
app.get('/getNextDayRoutes', (req, res) => {
  nextDayRoutes(req.query.destination)
    .then((rows) => res.send(rows))
    .catch((err) => res.send(err))
})
app.get('/getMinPrices', async (req, res) => {
  res.send(await minPrices())
})
app.get('/getNoTicketCases', async (req, res) => {
  res.send(await noTicketCase())
})
app.get('/getBusesSchedule', async (req, res) => {
  res.send(await busesSchedule())
})

// Extra
app.get('/getAvailableRoutes', async (req, res) => {
  pool.query(`
    SELECT 
      route.route_id, 
      route.date_of_route,
      route.time_of_route,
      route.price, 
      route.free_number_of_seats,
      route_info.point_of_arrival
    FROM route
    JOIN route_info on route.route_info_id=route_info.route_info_id
    WHERE free_number_of_seats != 0
  `)
    .then((dbRes) => res.send(dbRes.rows))
    .catch((error) => res.send({error}))
})
app.get('/getAvailableTickets', async (req, res) => {
  pool.query(`
    select 
      ticket_info.ticket_id,
      ticket_info.sum_for_ticket,
      route.date_of_route, 
      route.route_id,
      route.free_number_of_seats
      from ticket_info
    join route on route.route_id=ticket_info.route_id
    left join refunds on refunds.refund_id=ticket_info.refund_id
    where refunds.refund_id is null
  `)
    .then((dbRes) => res.send(dbRes.rows))
    .catch((error) => res.send({error}))
})

app.get('/resetDatabase', async (req, res) => {
  if (req.query.confirm) {
    pool.query(`
      DROP TABLE model CASCADE;
      DROP TABLE bus_info CASCADE;
      DROP TABLE route_info CASCADE;
      DROP TABLE route CASCADE;
      DROP TABLE ticket_info CASCADE;
      DROP TABLE refunds CASCADE;
      
      ${createTables}
      ${mockTables}
    `)
      .then(() => res.send({status: 'OK'}))
      .catch(error => {
        console.log(error);
        res.send(error)
      })
  }
})

const port = 5000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
