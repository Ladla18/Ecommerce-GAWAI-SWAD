const express = require("express");
const ticketController = require("../controllers/ticketConstroller")
router = express.Router();

router.post("/raiseticket/:id",ticketController.raiseTicket)
router.get("/fetchticket/:id",ticketController.fetchTickets)
router.patch("/closeticket/:id", ticketController.closeTicket);

module.exports = router