import React from "react";

export default function PasswordResetForm() {
  return (
    <div>
      <FormLabel htmlFor="password">New Password</FormLabel>
      <InputGroup>
        <Input
          id="password"
          {...InputStyles}
          type="password"
          placeholder="Password..."
          name="password"
          onChange={handleInputChange}
          value={formData.password}
          required
        />
      </InputGroup>

      <FormLabel htmlFor="passwordAgain">Confirm New Password</FormLabel>
      <InputGroup>
        <Input
          id="passwordAgain"
          {...InputStyles}
          type="password"
          placeholder="Confirm Password..."
          name="passwordAgain"
          onChange={handleInputChange}
          value={formData.passwordAgain}
          required
        />
      </InputGroup>
    </div>
  );
}
