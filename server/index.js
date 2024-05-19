const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomer,
  fetchReservation,
  fetchRestaurant,
  destroyReservation,
} = require("./db.js");
const express = require("express");
const app = express();

const init = async () => {
  console.log("connecting to db");
  await client.connect();
  console.log("connected to db");
  console.log("creating tables");
  await createTables();
  console.log("created tables");

  const [Tim, Scotty, Rod, Sansu, Toba, Saffron] = await Promise.all([
    createCustomer({ name: "Tim" }),
    createCustomer({ name: "Scotty" }),
    createCustomer({ name: "Rod" }),
    createRestaurant({ name: "Sansu" }),
    createRestaurant({ name: "Toba" }),
    createRestaurant({ name: "Saffron" }),
  ]);

  console.log(await fetchCustomer());
  console.log(await fetchRestaurant());

  const [reservation, reservation2] = await Promise.all([
    createReservation({
      customer_id: Tim.id,
      restaurant_id: Sansu.id,
      party_count: 4,
      date: "05/19/2024",
    }),

    createReservation({
      customer_id: Scotty.id,
      restaurant_id: Toba.id,
      party_count: 2,
      date: "05/22/2024",
    }),
  ]);

  console.log(await fetchReservation());
  await destroyReservation({
    id: reservation.id,
    customer_id: reservation.customer_id,
  });
  console.log(await fetchReservation());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(`curl localhost:${port}/api/customer`);
    console.log(`curl localhost:${port}/api/reservation`);
    console.log(`curl localhost:${port}/api/restaurant`);
  });

  app.get("/api/customer", async (req, res, next) => {
    try {
        res.send(await fetchCustomer());
    //   const SQL = `SELECT * FROM customer`;
    //   const response = await client.query(SQL);
    //   console.log(response);
    //   res.send(response.rows);
    } catch (ex) {
      next(ex);
    }
  });

app.post("/api/customer/:customer_id/reservations", async (req, res, next) => {
    try {
        res.status(201).send(await createReservation({ 
            id: req.params.id,
            customer_id: req.params.customer_id, 
            restaurant_id: req.body.restaurant_id, 
            party_count: req.body.party_count,
            date: req.body.date}))
    } catch (ex) {
        next(ex);
    }
})

};

init();
