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

INSERT INTO ticket_info(ticket_id, route_id, privilege, sum_for_ticket, date_of_sale)
VALUES
(1, 1, '0%', 300, TO_DATE('10/10/20', 'DD/MM/YY')),
    (2, 1, '0%', 300, TO_DATE('11/10/20', 'DD/MM/YY')),
    (3, 1, '0%', 300, TO_DATE('10/10/20', 'DD/MM/YY')),
    (4, 1, '0%', 300, TO_DATE('11/10/20', 'DD/MM/YY')),
    (5, 1, '0%', 300, TO_DATE('10/10/20', 'DD/MM/YY')),
    (6, 1, '0%', 300, TO_DATE('11/10/20', 'DD/MM/YY')),
    (7, 1, '0%', 300, TO_DATE('11/10/20', 'DD/MM/YY')),
    (8, 2, '0%', 350, TO_DATE('10/10/20', 'DD/MM/YY')),
    (9, 2, '0%', 350, TO_DATE('11/10/20', 'DD/MM/YY')),
    (10, 2, '0%', 350, TO_DATE('12/10/20', 'DD/MM/YY')),
    (11, 2, '0%', 350, TO_DATE('12/10/20', 'DD/MM/YY')),
    (12, 2, '0%', 350, TO_DATE('13/10/20', 'DD/MM/YY')),
    (13, 3, '0%', 400, TO_DATE('17/10/20', 'DD/MM/YY')),
    (14, 3, '0%', 400, TO_DATE('10/10/20', 'DD/MM/YY')),
    (15, 3, '0%', 400, TO_DATE('17/10/20', 'DD/MM/YY')),
    (16, 3, '0%', 400, TO_DATE('13/10/20', 'DD/MM/YY')),
    (17, 3, '30%', 280, TO_DATE('10/10/20', 'DD/MM/YY')),
    (18, 3, '0%', 400, TO_DATE('10/10/20', 'DD/MM/YY')),
    (19, 3, '0%', 400, TO_DATE('17/10/20', 'DD/MM/YY')),
    (20, 3, '0%', 400, TO_DATE('19/10/20', 'DD/MM/YY')),
    (21, 3, '0%', 400, TO_DATE('10/10/20', 'DD/MM/YY')),
    (22, 3, '40%', 240, TO_DATE('17/10/20', 'DD/MM/YY')),
    (23, 3, '60%', 160, TO_DATE('10/10/20', 'DD/MM/YY')),
    (24, 4, '0%', 280, TO_DATE('17/10/20', 'DD/MM/YY')),
    (25, 4, '0%', 280, TO_DATE('17/10/20', 'DD/MM/YY')),
    (26, 4, '0%', 280, TO_DATE('10/10/20', 'DD/MM/YY')),
    (27, 4, '0%', 280, TO_DATE('10/10/20', 'DD/MM/YY')),
    (28, 4, '0%', 280, TO_DATE('10/10/20', 'DD/MM/YY')),
    (29, 5, '0%', 400, TO_DATE('15/10/20', 'DD/MM/YY')),
    (30, 5, '0%', 400, TO_DATE('11/10/20', 'DD/MM/YY')),
    (31, 6, '0%', 400, TO_DATE('13/10/20', 'DD/MM/YY')),
    (32, 6, '0%', 400, TO_DATE('10/10/20', 'DD/MM/YY')),
    (33, 6, '0%', 400, TO_DATE('10/10/20', 'DD/MM/YY')),
    (34, 6, '0%', 350, TO_DATE('11/10/20', 'DD/MM/YY')),
    (35, 6, '0%', 400, TO_DATE('10/10/20', 'DD/MM/YY')),
    (36, 6, '0%', 400, TO_DATE('13/10/20', 'DD/MM/YY')),
    (37, 6, '0%', 400, TO_DATE('15/10/20', 'DD/MM/YY')),
    (38, 7, '0%', 300, TO_DATE('13/10/20', 'DD/MM/YY')),
    (39, 7, '0%', 300, TO_DATE('10/10/20', 'DD/MM/YY')),
    (40, 7, '0%', 300, TO_DATE('13/10/20', 'DD/MM/YY')),
    (41, 8, '0%', 350, TO_DATE('15/10/20', 'DD/MM/YY')),
    (42, 8, '0%', 350, TO_DATE('15/10/20', 'DD/MM/YY')),
    (43, 8, '0%', 350, TO_DATE('13/10/20', 'DD/MM/YY')),
    (44, 8, '0%', 350, TO_DATE('15/10/20', 'DD/MM/YY')),
    (45, 8, '0%', 350, TO_DATE('10/10/20', 'DD/MM/YY')),
    (46, 8, '70%', 105, TO_DATE('10/10/20', 'DD/MM/YY')),
    (47, 8, '70%', 105, TO_DATE('10/10/20', 'DD/MM/YY')),
    (49, 8, '0%', 350, TO_DATE('14/10/20', 'DD/MM/YY')),
    (48, 8, '0%', 350, TO_DATE('10/10/20', 'DD/MM/YY')),
    (50, 8, '0%', 350, TO_DATE('16/10/20', 'DD/MM/YY')),
    (51, 8, '0%', 350, TO_DATE('15/10/20', 'DD/MM/YY')),
    (52, 9, '0%', 500, TO_DATE('10/10/20', 'DD/MM/YY')),
    (53, 9, '0%', 500, TO_DATE('16/10/20', 'DD/MM/YY')),
    (54, 9, '0%', 500, TO_DATE('10/10/20', 'DD/MM/YY')),
    (55, 9, '0%', 500, TO_DATE('16/10/20', 'DD/MM/YY')),
    (56, 10, '30%', 210, TO_DATE('16/10/20', 'DD/MM/YY')),
    (57, 10, '30%', 210, TO_DATE('16/10/20', 'DD/MM/YY')),
    (58, 10, '30%', 210, TO_DATE('16/10/20', 'DD/MM/YY')),
    (59, 10, '30%', 210, TO_DATE('16/10/20', 'DD/MM/YY')),
    (60, 10, '0%', 300, TO_DATE('10/10/20', 'DD/MM/YY'));

INSERT INTO refunds(date_of_return, sum_of_return, ticket_id, refund_id)
VALUES
('2020-10-13', 350, 10, 10),
('2020-10-20', 400, 20, 20),
('2020-10-19', 80, 29, 29),
('2020-11-13', 80, 30, 30),
('2020-10-12', 400, 34, 34),
('2020-10-15', 175, 49, 49);
