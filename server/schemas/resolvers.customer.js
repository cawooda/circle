const { Customer, User, Provider } = require("../models");
const { verifyToken } = require("../utils/helpers");

module.exports = {
  addCustomer: async (
    _parent,
    {
      token,
      providerId,
      first,
      last,
      mobile,
      email,
      invoiceEmail,
      referenceNumber,
      referenceName,
      dateOfBirth,
    },
    context
  ) => {
    try {
      if (!verifyToken(token))
        throw new Error("Could not verify with that token");
      let user = await User.findOneAndUpdate(
        { first, last, dateOfBirth },
        { email }
      );
      if (!user) {
        user = await User.create({ first, last, mobile, email });
      }
      if (!user) {
        throw new Error("Could not add or find user in addCustomer resolver");
      }

      // Step 3: Check if the customer exists or create a new customer
      let customer = await Customer.findById(user.roleCustomer);
      if (!customer) {
        customer = await Customer.create({
          user: user._id,
          invoiceEmail,
          referenceName,
          referenceNumber,
          dateOfBirth,
        });
        // Link the newly created customer to the user
        if (!customer)
          throw new Error("Could not add customer in addCustomer resolver");
        user.roleCustomer = customer._id;
        await user.save();
      } else {
        // Update existing customer with the provided details
        await Customer.findByIdAndUpdate(
          customer._id,
          {
            invoiceEmail,
            referenceName,
            referenceNumber,
            dateOfBirth,
          },
          { new: true }
        );
      }

      console.log("Customer:", customer);

      // Step 4: Link the customer to the provider
      const provider = await Provider.findById(providerId);
      if (provider) {
        await provider.updateOne({
          $addToSet: { linkedCustomers: customer._id },
        });
      }
      await provider.save();
      return provider.toObject();
    } catch (error) {
      console.error("Error in addCustomer resolver:", error.message);
    }
  },
};
