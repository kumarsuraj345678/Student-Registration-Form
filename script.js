document.addEventListener("DOMContentLoaded", function () {
  // Password validation and checking
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordMessage = document.getElementById("password-message");
  const strengthBars = document.querySelectorAll(".password-strength .bar");
  const form = document.querySelector("form");

  // Input fields validation mapping - updated to match HTML patterns
  const validationConfig = {
    fname: {
      pattern: /^[A-Za-z]{1,32}$/,
      message:
        "First name should contain only letters (max 30 characters)",
    },
    lname: {
      pattern: /^[A-Za-z]{1,32}$/,
      message:
        "Last name should contain only letters (max 30 characters)",
    },
    age: {
      pattern: /^(1[5-9]|[2-9][0-9])$/,
      message: "Age must be between 15 and 99",
    },
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/,
      message: "Please enter a valid email address",
    },
    "phone-number": {
      pattern: /^[6-9][0-9]{9}$/,
      message: "Phone number must start with 6-9 and have 10 digits",
    },
    pincode: {
      pattern: /^[0-9]{6}$/,
      message: "Pin code must be a 6-digit number",
    },
    password: {
      pattern:
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
      message:
        "Password must be atleast 10 characters with an uppercase, lowercase, number, and special character (@,$,!,%,?,&).",
    },
  };

  // Add validation to all required inputs
  const inputs = document.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );

  inputs.forEach((input) => {
    // Skip radio buttons and checkboxes for this type of validation
    if (
      input.type === "radio" ||
      input.type === "checkbox" ||
      input.type === "file"
    )
      return;

    // Add blur event for validation
    input.addEventListener("blur", function () {
      validateInput(this);
    });

    // Add input event for real-time validation
    input.addEventListener("input", function () {
      // Remove error as user types
      this.classList.remove("invalid");
      const errorMsg = this.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains("error-message")) {
        errorMsg.remove();
      }
    });
  });

  // Date of Birth validation
  const dobInput = document.getElementById("dob");
  dobInput.addEventListener("blur", function () {
    const selectedDate = new Date(this.value);
    const today = new Date();
    const minAge = 15;
    const maxAge = 99;

    // Calculate max and min valid dates
    const minValidDate = new Date();
    minValidDate.setFullYear(today.getFullYear() - maxAge);

    const maxValidDate = new Date();
    maxValidDate.setFullYear(today.getFullYear() - minAge);

    if (selectedDate > maxValidDate || selectedDate < minValidDate) {
      showError(
        this,
        `Date of birth must indicate an age between ${minAge} and ${maxAge} years`
      );
      // Clear the age field
      const ageInput = document.getElementById("age");
      if (ageInput) {
        ageInput.value = "";
      }
    } else {
      clearError(this);
      // Recalculate age
      calculateAge();
    }
  });

  // Password strength indicator
  passwordInput.addEventListener("input", function () {
    const password = this.value;
    const strength = checkPasswordStrength(password);

    // Update strength bars
    strengthBars.forEach((bar, index) => {
      if (index < strength) {
        bar.style.backgroundColor = getColorForStrength(strength);
      } else {
        bar.style.backgroundColor = "#eee";
      }
    });

    // Check password match
    if (confirmPasswordInput.value) {
      checkPasswordMatch();
    }
  });

  // Password and confirm password match - fixed version
  function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword.length === 0) {
      passwordMessage.textContent = "";
      confirmPasswordInput.classList.remove("invalid");
      return;
    }

    if (password === confirmPassword) {
      passwordMessage.textContent = "✅ Passwords match";
      passwordMessage.style.color = "var(--success)";
      confirmPasswordInput.classList.remove("invalid");
      clearError(confirmPasswordInput);
    } else {
      passwordMessage.textContent = "❌ Passwords do not match";
      passwordMessage.style.color = "var(--error)";
      confirmPasswordInput.classList.add("invalid");
    }
  }

  // Listen for changes in the Confirm Password field
  confirmPasswordInput.addEventListener("input", checkPasswordMatch);

  function checkPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;

    return strength;
  }

  function getColorForStrength(strength) {
    switch (strength) {
      case 1:
        return "#f44336"; // Very weak - red
      case 2:
        return "#ff5722"; // Weak - dark orange
      case 3:
        return "#ff9800"; // Medium - orange
      case 4:
        return "#ffc107"; // Good - yellow
      case 5:
        return "#4caf50"; // Strong - green
      default:
        return "#eee";
    }
  }

  // Toggle password visibility
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const targetInput = document.getElementById(targetId);

      if (targetInput.type === "password") {
        targetInput.type = "text";
        this.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        targetInput.type = "password";
        this.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  // File upload handling
  const fileInput = document.getElementById("myfile");
  const fileInfo = document.querySelector(".file-info");
  const fileLabel = document.querySelector(".file-label span");
  const removeFileBtn = document.getElementById("remove-file");

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      const fileName = this.files[0].name;
      const fileSize = this.files[0].size / 1024; 
      const maxSize = 2048; 

      if (fileSize > maxSize) {
        showError(this, "File is too big! Maximum size is 2MB.");
        this.value = "";
        fileInfo.textContent = "No file chosen (Max size: 2MB)";
        fileLabel.textContent = "Choose a file";
        removeFileBtn.style.display = "none";
      } else {
        fileLabel.textContent = fileName;
        fileInfo.textContent = `${fileName} (${(fileSize / 1024).toFixed(
          2
        )} MB)`;
        clearError(this);
        removeFileBtn.style.display = "inline-block";
      }
    } else {
      fileInfo.textContent = "No file chosen (Max size: 2MB)";
      fileLabel.textContent = "Choose a file";
      removeFileBtn.style.display = "none";
    }
  });

  // Remove file functionality
  removeFileBtn.addEventListener("click", function () {
    fileInput.value = "";
    fileInfo.textContent = "No file chosen (Max size: 2MB)";
    fileLabel.textContent = "Choose a file";
    this.style.display = "none";
    clearError(fileInput);
  });

  // Helper function to validate a single input
  function validateInput(input) {
    // Skip if input is empty and not required
    if (!input.value && !input.hasAttribute("required")) {
      return true;
    }

    // Get validation rules
    const config = validationConfig[input.id] || validationConfig[input.name];

    if (config && config.pattern) {
      if (!config.pattern.test(input.value)) {
        showError(input, config.message);
        return false;
      } else {
        clearError(input);
        return true;
      }
    }

    // If no specific validation but required and empty
    if (input.hasAttribute("required") && !input.value) {
      showError(input, "This field is required");
      return false;
    }

    clearError(input);
    return true;
  }

  // Helper function to show error message
  function showError(input, message) {
    clearError(input); // Remove any existing error first

    input.classList.add("invalid");
    const errorMsg = document.createElement("div");
    errorMsg.className = "error-message";
    errorMsg.textContent = message;

    // Special handling for elements with parent containers
    if (
      input.closest(".password-container") ||
      input.closest(".phone-input") ||
      input.closest(".file-upload") ||
      input.closest(".custom_select")
    ) {
      let parent;
      if (input.closest(".password-container")) {
        parent = input.closest(".password-container");
      } else if (input.closest(".phone-input")) {
        parent = input.closest(".phone-input");
      } else if (input.closest(".file-upload")) {
        parent = input.closest(".file-upload");
      } else if (input.closest(".custom_select")) {
        parent = input.closest(".custom_select");
      }

      if (
        parent &&
        !parent.nextElementSibling?.classList.contains("error-message")
      ) {
        parent.insertAdjacentElement("afterend", errorMsg);
      }
    } else {
      // Normal inputs
      if (!input.nextElementSibling?.classList.contains("error-message")) {
        input.insertAdjacentElement("afterend", errorMsg);
      }
    }
  }

  // Helper function to clear error
  function clearError(input) {
    input.classList.remove("invalid");

    // Check for special containers
    if (
      input.closest(".password-container") ||
      input.closest(".phone-input") ||
      input.closest(".file-upload") ||
      input.closest(".custom_select")
    ) {
      let parent;
      if (input.closest(".password-container")) {
        parent = input.closest(".password-container");
      } else if (input.closest(".phone-input")) {
        parent = input.closest(".phone-input");
      } else if (input.closest(".file-upload")) {
        parent = input.closest(".file-upload");
      } else if (input.closest(".custom_select")) {
        parent = input.closest(".custom_select");
      }

      if (
        parent &&
        parent.nextElementSibling?.classList.contains("error-message")
      ) {
        parent.nextElementSibling.remove();
      }
    } else {
      // Normal inputs
      if (input.nextElementSibling?.classList.contains("error-message")) {
        input.nextElementSibling.remove();
      }
    }
  }

  // Validate radio button groups
  function validateRadioGroup(name) {
    const radioButtons = document.querySelectorAll(
      `input[type="radio"][name="${name}"]`
    );
    const anyChecked = Array.from(radioButtons).some((radio) => radio.checked);

    if (!anyChecked) {
      // Find the container and add error
      const container = radioButtons[0].closest(".inputfield");
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = "Please select an option";

      if (!container.querySelector(".error-message")) {
        container.appendChild(errorMsg);
      }
      return false;
    } else {
      // Clear error if exists
      const container = radioButtons[0].closest(".inputfield");
      const existingError = container.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }
      return true;
    }
  }

  // Form validation before submit
  form.addEventListener("submit", function (e) {
    let isValid = true;

    // Validate all required inputs
    inputs.forEach((input) => {
      if (input.type !== "radio" && input.type !== "checkbox") {
        if (!validateInput(input)) {
          isValid = false;
        }
      }
    });

    // Validate radio groups
    const genderValid = validateRadioGroup("gender");
    if (!genderValid) isValid = false;

    // Validate password match
    if (passwordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Passwords do not match");
      isValid = false;
    }

    // Validate file input
    if (fileInput.hasAttribute("required") && !fileInput.files.length) {
      showError(fileInput, "Please select a file");
      isValid = false;
    }

    // Validate hobbies (at least one selected) if any exist
    const hobbiesCheckboxes = document.querySelectorAll(
      'input[name="hobbies"]'
    );
    if (hobbiesCheckboxes.length > 0) {
      const anyChecked = Array.from(hobbiesCheckboxes).some((cb) => cb.checked);
      if (!anyChecked) {
        const container = hobbiesCheckboxes[0].closest(".inputfield");
        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = "Please select at least one hobby";

        if (!container.querySelector(".error-message")) {
          container.appendChild(errorMsg);
        }
        isValid = false;
      } else {
        const container = hobbiesCheckboxes[0].closest(".inputfield");
        const existingError = container.querySelector(".error-message");
        if (existingError) {
          existingError.remove();
        }
      }
    }

    if (!isValid) {
      e.preventDefault();
      // Scroll to the first error
      const firstError = document.querySelector(".invalid, .error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Show alert
      alert("Please fix the errors before submitting.");
    }
  });

  const secondaryButton = document.querySelector(".btn-secondary");
  // Handle form reset for all UI elements and error messages
  secondaryButton.addEventListener("click", function () {
    // Reset file input UI
    fileInput.value = "";
    fileLabel.textContent = "Choose a file";
    fileInfo.textContent = "No file chosen (Max size: 2MB)";
    removeFileBtn.style.display = "none";

    // Reset password strength bars
    const strengthBars = document.querySelectorAll(".password-strength .bar");
    strengthBars.forEach((bar) => {
      bar.style.backgroundColor = "#eee";
    });

    // Reset password message
    const passwordMessage = document.getElementById("password-message");
    if (passwordMessage) {
      passwordMessage.textContent = "";
    }

    // Remove all error messages and invalid classes
    const allErrorMessages = document.querySelectorAll(".error-message");
    allErrorMessages.forEach((error) => error.remove());

    const allInvalidInputs = document.querySelectorAll(".invalid");
    allInvalidInputs.forEach((input) => input.classList.remove("invalid"));

    // Reset any other custom validation visuals
    const customCheckboxes = document.querySelectorAll(
      '.terms .check input[type="checkbox"]'
    );
    customCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Give the form a moment to process native reset before checking for remaining issues
    setTimeout(() => {
      // Double check for any elements that might need special handling
      document.querySelectorAll("input, select, textarea").forEach((input) => {
        clearError(input);
      });
    }, 10);
  });

  const primaryButton = document.querySelector(".btn-primary");

  function addButtonClickEffect(button) {
    // Reusable function
    button.addEventListener("click", () => {
      button.classList.add("clicked");
      setTimeout(() => {
        button.classList.remove("clicked");
      }, 100); // 100-millisecond delay
    });
  }

  addButtonClickEffect(primaryButton);
  addButtonClickEffect(secondaryButton);
});

document.addEventListener("DOMContentLoaded", function () {
  const dobInput = document.getElementById("dob");
  const ageInput = document.getElementById("age");

  // Function to calculate age
  function calculateAge() {
    const dobValue = dobInput.value;
    if (dobValue) {
      const dob = new Date(dobValue);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      // Ensure age is valid (between 15 and 99)
      if (age < 15 || age > 99) {
        ageInput.value = "";
        alert("Age must be between 15 and 99 years.");
      } else {
        ageInput.value = age;
      }
    }
  }

  // Event listener to update age when DOB is selected
  dobInput.addEventListener("change", calculateAge);

  // Prevent manual input in the age field
  ageInput.setAttribute("readonly", true);
});
