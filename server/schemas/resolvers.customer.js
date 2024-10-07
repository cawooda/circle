const { Customer, User, Provider } = require("../models");

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
      // Step 1: Check if the user exists
      let user = await User.findOne({ first, last, dateOfBirth });

      // Step 2: Create the user if they do not exist
      if (!user) {
        user = await User.create({ first, last, mobile, email });
      }

      if (!user) {
        throw new Error("Could not add or find user in addCustomer resolver");
      }

      console.log("User:", user);

      // Step 3: Check if the customer exists or create a new customer
      let customer = await Customer.findById(user.roleCustomer);
      if (!customer) {
        customer = await Customer.create({
          invoiceEmail,
          referenceName,
          referenceNumber,
          dateOfBirth,
        });

        // Link the newly created customer to the user
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

      console.log("Provider updated successfully");
    } catch (error) {
      console.error("Error in addCustomer resolver:", error.message);
    }
  },
};
