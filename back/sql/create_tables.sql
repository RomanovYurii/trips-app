-- Создание таблиц
CREATE TABLE model(
    bus_number VARCHAR(8) PRIMARY KEY ,
    model VARCHAR(120),
    number_of_seats INTEGER NOT NULL CHECK (model.number_of_seats>0)
);

CREATE TABLE bus_info(
    bus_id SERIAL PRIMARY KEY NOT NULL CHECK (bus_id>0),
    bus_number VARCHAR(8),
    brand VARCHAR(50),
    FOREIGN KEY  (bus_number) REFERENCES model(bus_number)
);

CREATE TABLE route_info(
    route_info_id SERIAL PRIMARY KEY NOT NULL CHECK (route_info.route_info_id>0),
    distance INTEGER NOT NULL CHECK (route_info.distance>0),
    point_of_arrival VARCHAR(20)
);

CREATE TABLE route(
    route_id SERIAL PRIMARY KEY NOT NULL CHECK (route.route_id>0),
    date_of_route DATE NOT NULL,
    time_of_route TIME NOT NULL,
    price INTEGER NOT NULL CHECK (route.price>0),
    free_number_of_seats INTEGER CHECK (route.price>=0),
    bus Serial NOT NULL CHECK (route.bus>0),
    route_info_id SERIAL NOT NULL CHECK (route.route_info_id>0),
    FOREIGN KEY  (bus) REFERENCES bus_info(bus_id),
    FOREIGN KEY  (route_info_id) REFERENCES route_info(route_info_id)
);

CREATE TABLE ticket_info(
    ticket_id SERIAL NOT NULL CHECK (ticket_info.ticket_id>0),
    date_of_sale DATE NOT NULL,
    route_id SERIAL NOT NULL CHECK (ticket_info.route_id>0),
    privilege VARCHAR(5),
    sum_for_ticket INTEGER NOT NULL CHECK (ticket_info.sum_for_ticket>0),
    refund_id SERIAL PRIMARY KEY NOT NULL CHECK (ticket_info.refund_id>0),
    FOREIGN KEY  (route_id) REFERENCES route(route_id)
);

CREATE TABLE refunds(
    ticket_id SERIAL NOT NULL CHECK (refunds.ticket_id>0),
    date_of_return DATE NOT NULL,
    sum_of_return INTEGER NOT NULL CHECK (refunds.sum_of_return>0),
    refund_id SERIAL NOT NULL CHECK (refunds.refund_id>0),
  FOREIGN KEY  (refund_id) REFERENCES ticket_info(refund_id)
);

CREATE UNIQUE INDEX route_dx ON route (route_id);
CREATE UNIQUE INDEX route_info_dx ON route_info (route_info_id);
CREATE UNIQUE INDEX bus_info_dx ON bus_info (bus_id);
CREATE UNIQUE INDEX return_dx ON return (refund_id);
CREATE UNIQUE INDEX ticket_dx ON ticket_info (ticket_id);

