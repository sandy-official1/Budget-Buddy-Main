const Order = require("../Models/orders");
const Razorpay = require("razorpay");
// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: "rzp_test_YjiHLDNnRzK6x4",
  key_secret: "zbckQJ7Z1O1Q0kCKfeqAgPRg",
});

exports.postPremiumMembership = async (req, res) => {
  try {
    const { userId } = req.user;

    // Create an order with status PENDING and orderId as null
    const order = await Order.create({
      status: "PENDING",
      orderId: "placeholder_value", // Provide a placeholder value for orderId
    });

    // Generate a Razorpay order ID
    const options = {
      amount: 100, // Example: 10000 represents ₹100.00
      currency: "INR",
      receipt: `order_${order.id}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Update the order with Razorpay order details
    await order.update({
      orderId: razorpayOrder.id, // Update orderId with Razorpay order ID
    });

    res.json({ orderId: razorpayOrder.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.preMembership = async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === "payment.captured") {
      const { order_id } = payload;

      // Find the order by Razorpay order ID
      const order = await Order.findOne({ where: { orderId: order_id } });

      if (order) {
        // Update the order status to SUCCESSFUL
        await order.update({ status: "SUCCESSFUL" });

        // Make the current user a premium user (You need to implement this logic)

        // Send a response back to Razorpay
        res.sendStatus(200);
      } else {
        // Invalid order ID
        res.sendStatus(400);
      }
    } else if (event === "payment.failed") {
      // Handle payment failure event

      // Send a response back to Razorpay
      res.sendStatus(200);
    } else {
      // Unsupported event
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
