<template>
  <div class="signup-container">
    <div class="image-section">
      <v-carousel
        v-model="carouselModel"
        hide-delimiters
        height="100%"
        class="carousel"
        :show-arrows="false"
        :cycle="true"
        :interval="2000"
        hide-controls
      >
        <v-carousel-item
          v-for="(image, i) in carouselImages"
          :key="i"
          :src="image"
          cover
          class="carousel-item"
        >
        </v-carousel-item>
      </v-carousel>
    </div>

    <div class="form-section">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="form-container">
        <h1 class="form-title">Create an Account</h1>
        <p class="form-subtitle">
          Already have an account?
          <router-link to="/login" class="login-link">Log in</router-link>
        </p>

        <div class="form-grid">
          <v-text-field
            v-model="firstName"
            label="First Name"
            variant="outlined"
            color="var(--color-light-blue)"
            bg-color="var(--color-light-blue-18)"
            class="input-field"
          ></v-text-field>

          <v-text-field
            v-model="lastName"
            label="Last Name"
            variant="outlined"
            color="var(--color-light-blue)"
            bg-color="var(--color-light-blue-18)"
            class="input-field"
          ></v-text-field>
        </div>

        <v-text-field
          v-model="email"
          label="Email"
          variant="outlined"
          color="var(--color-light-blue)"
          bg-color="var(--color-light-blue-18)"
          class="input-field"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          variant="outlined"
          type="password"
          color="var(--color-light-blue)"
          bg-color="var(--color-light-blue-18)"
          class="input-field"
        ></v-text-field>

        <v-btn
          block
          color="var(--color-light-blue)"
          size="large"
          class="submit-btn"
          @click="handleSignup"
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
        </v-btn>


      </div>
    </div>
  </div>
</template>

<script setup>


import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const carouselModel = ref(0)
const loading = ref(false)
const error = ref('')

const carouselImages = [
  '/assets/images/auth/cloud-bg.jpg',
  '/assets/images/auth/kid-pencil.jpg'
];

const validateForm = () => {
  if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value) {
    throw new Error('Please fill in all fields')
  }

  if (!email.value.includes('@') || !email.value.includes('.')) {
    throw new Error('Please enter a valid email address')
  }

  if (password.value.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }
}

const handleSignup = async () => {
  error.value = '';
  loading.value = true;

  try {
    validateForm();

    const registrationData = {
      email: email.value,
      first_name: firstName.value,
      last_name: lastName.value,
      password: password.value
    };

    // Attempt to register the user
    await authService.register(registrationData);

    // Login after successful registration
    await authService.login(
      email.value,
      password.value
  );

    // Navigate to assessment
    router.push('/assessment');
  } catch (err) {
    if (err.message.includes('user with this email address already exists')) {
      error.value = 'This email address is already associated with another account.';
    } else if (err.message.includes('A user with that username already exists')) {
      error.value = 'This username is already taken. Please choose another one.';
    } else {
      error.value = err.message || 'An unexpected error occurred. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};



</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.image-section {
  padding: 2rem; /* Added padding around the image section */
  height: 100%;
}

.carousel {
  height: 100%;
  border-radius: 24px; /* Increased border radius */
  overflow: hidden;
}

.carousel-item {
  border-radius: 24px; /* Match carousel border radius */
}

.error-message {
  color: #ff4444;
  text-align: center;
  font-family: 'Fredoka', sans-serif;
  padding: 1rem;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
  font-weight: 500;
  width: 100%;
  max-width: 480px; /* Ensure it matches the form width */
  margin-bottom: 2rem; /* Add margin to separate from form */
}

.form-section {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.form-container {
  width: 100%;
  max-width: 480px;
}

.form-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #000;
}

.form-subtitle {
  margin-bottom: 2rem;
  color: #666;
}

.login-link {
  color: var(--color-light-blue);
  text-decoration: none;
  font-weight: 500;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-field {
  margin-bottom: 1rem;
}

:deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-field__overlay) {
  background-color: var(--color-light-blue-18);
  opacity: 1;
}

:deep(.v-field__field) {
  color: var(--color-light-blue);
}

.submit-btn {
  margin-top: 1rem;
  height: 56px !important;
  font-family: 'Fredoka', sans-serif !important;
  font-size: 1.25rem !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  border-radius: 8px !important;
}

@media (max-width: 960px) {
  .signup-container {
    grid-template-columns: 1fr;
  }

  .image-section {
    display: none; /* Only hide image on smaller screens */
  }

  .form-section {
    padding: 2rem;
  }
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-section {
    padding: 1rem;
  }

  .form-title {
    font-size: 2rem;
  }
}
</style>

