const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token:
    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
});

module.exports = {
  home: (req, res) => {
    return res.render("index");
  },

  callback: (req, res) => {
    console.log(req.query);

    if (req.query.status.includes("success")) {
      return res.render("success", {
        payment_type: req.query.payment_type,
        external_reference: req.query.external_reference,
        collection_id: req.query.collection_id,
      });
    }

    if (req.query.status.includes("pending")) {
      return res.render("pending");
    }

    if (req.query.status.includes("failure")) {
      return res.render("failure");
    }
  },

  notifications: (req, res) => {
    console.log("webhook", req.body);

    res.status(200).end("Ok");
  },

  detail: (req, res) => {
    const host = "https://mercadopago-ayr.herokuapp.com/";
    const url = host + "callback?status=";

    let preference = {
      back_urls: {
        success: url + "success",
        pending: url + "pending",
        failure: url + "failure",
      },

      notification_url: host + "notifications",

      auto_return: "approved",

      payer: {
        name: "Lalo",
        surname: "Landa",
        email: "test_user_63274575@testuser.com",
        phone: {
          area_code: "11",
          number: 22223333,
        },
        address: {
          zip_code: "1111",
          street_name: "False",
          street_number: 123,
        },
      },

      payment_methods: {
        excluded_payment_methods: [
          {
            id: "amex",
          },
        ],
        excluded_payment_types: [
          {
            id: "atm",
          },
        ],
        installments: 6,
      },

      items: [
        {
          id: 1234,
          picture_url: `https://mercadopago-ayr.herokuapp.com/images/products/${req.query.img}`,
          title: req.query.title,
          description: "Dispositivo móvil de Tienda e-commerce",
          unit_price: Number(req.query.price),
          quantity: Number(req.query.unit),
        },
      ],

      external_reference: "themasterayrx@hotmail.com",
    };
    mercadopago.preferences
      .create(preference)
      .then((response) => {
        preference_init = response.body;
        res.render("detail", { ...req.query, preference_init });
      })
      .catch((error) => {
        console.log(error);

        res.send("error");
      });
  },
};
