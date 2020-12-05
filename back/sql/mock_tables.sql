-- Заполнение данными
INSERT INTO model(bus_number, model, number_of_seats)
VALUES
('AA8888AA', 'Mercedes-Benz Sprinter Classic', 10),
('AA4444AA', 'Volkswagen Crafter', 8),
('AA0000AA', 'Icarus 620', 12),
('AA1111AA', 'Mercedes-Benz Sprinter Classic', 10),
('AA2222AA', 'Mercedes-Benz Tourismo', 8);

INSERT INTO bus_info(bus_id, bus_number, brand)
VALUES
(1, 'AA8888AA', 'Mercedes'),
(2, 'AA4444AA', 'Volkswagen'),
(3, 'AA0000AA', 'Ikarus'),
(4, 'AA1111AA', 'Mercedes'),
(5, 'AA2222AA', 'Mercedes');

INSERT INTO route_info(route_info_id, distance, point_of_arrival)
VALUES
(1, 140, 'Zhitomyr'),
(2, 142, 'Chernihiv'),
(3, 481, 'Kharkiv'),
(4, 200, 'Cherkassy'),
(5, 457, 'Dnipro'),
(6, 140, 'Zhitomyr'),
(7, 335, 'Summi'),
(8, 142, 'Chernihiv'),
(9, 475, 'Odesa'),
(10, 142, 'Chernihiv');

INSERT INTO route(bus, free_number_of_seats, date_of_route, time_of_route, price, route_info_id)
VALUES
(1, 3, '2020/10/11', '10:00', 300, 1),
(2, 4, '2020/10/11', '15:00', 350, 2),
(3, 2, '2020/10/11', '18:00', 400, 3),
(4, 5, '2020/11/11', '10:00', 280, 4),
(5, 7, '2020/11/11', '16:00', 400, 5),
(1, 4, '2020/11/12', '10:00', 400, 6),
(2, 5, '2020/11/12', '15:00', 300, 7),
(3, 2, '2020/11/13', '12:00', 350, 8),
(4, 6, '2020/11/13', '17:00', 500, 9),
(5, 3, '2020/11/14', '12:00', 300, 10);

INSERT INTO ticket_info(route_id, privilege, sum_for_ticket, date_of_sale)
VALUES
(1, '0%', 300, TO_DATE('10/10/20', 'DD/MM/YY')),
(1, '0%', 300, TO_DATE('11/10/20', 'DD/MM/YY')),
(1, '0%', 300, TO_DATE('10/10/20', 'DD/MM/YY')),
(1, '0%', 300, TO_DATE('11/10/20', 'DD/MM/YY')),
(1, '0%', 300, TO_DATE('10/10/20', 'DD/MM/YY')),
(1, '0%', 300, TO_DATE('11/10/20', 'DD/MM/YY')),
(1, '0%', 300, TO_DATE('11/10/20', 'DD/MM/YY')),
(2, '0%', 350, TO_DATE('10/10/20', 'DD/MM/YY')),
(2, '0%', 350, TO_DATE('11/10/20', 'DD/MM/YY')),
(2, '0%', 350, TO_DATE('12/10/20', 'DD/MM/YY')),
(2, '0%', 350, TO_DATE('12/10/20', 'DD/MM/YY')),
(2, '0%', 350, TO_DATE('13/10/20', 'DD/MM/YY')),
(3, '0%', 400, TO_DATE('17/10/20', 'DD/MM/YY')),
(4, '0%', 400, TO_DATE('10/10/20', 'DD/MM/YY')),
(5, '0%', 400, TO_DATE('17/10/20', 'DD/MM/YY')),
(6, '0%', 400, TO_DATE('13/10/20', 'DD/MM/YY')),
(7, '30%', 280, TO_DATE('10/10/20', 'DD/MM/YY')),
(8, '0%', 400, TO_DATE('10/10/20', 'DD/MM/YY')),
(9, '0%', 400, TO_DATE('17/10/20', 'DD/MM/YY')),
(10, '0%', 400, TO_DATE('19/10/20', 'DD/MM/YY'));

INSERT INTO refunds(date_of_return, sum_of_return, ticket_id, refund_id)
VALUES
('2020-10-13', 350, 1, 1),
('2020-10-20', 400, 2, 2),
('2020-10-19', 80, 3, 3),
('2020-11-13', 80, 4, 4),
('2020-10-12', 400, 5, 5),
('2020-10-15', 175, 6, 6);
