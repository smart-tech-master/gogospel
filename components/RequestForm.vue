<template>
  <div v-if="user">
    <h2 class="headline" v-if="isSuccess">Thank you for your submission!</h2>

    <v-form
      v-if="!isSuccess"
      v-model="valid"
      method="POST"
      @submit.prevent="onSubmit">
      <v-col cols="12" class="pa-0">
        <p class="font-weight-bold title mb-3">Your Request</p>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-text-field
          filled
          v-model="name"
          :rules="nameRules"
          label="Name"
          type="text"
          name="name"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-textarea
          v-model="message"
          :rules="messageRules"
          filled
          auto-grow
          :label="`What would you like ${user.name} to help you with?`"
          rows="3"
          row-height="30"
          required
        ></v-textarea>
      </v-col>

      <v-col cols="12" class="pa-0">
        <p class="font-weight-bold title my-3">Contact Information</p>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-text-field
          filled
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          type="email"
          name="email"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-text-field
          filled
          v-model="phoneNumber"
          :rules="phoneNumberRules"
          label="Phone Number"
          type="text"
          name="text"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary font-weight-bold"
            style="letter-spacing: -0.04em;"
            :disabled="!valid || isSaving"
            large
            width="100%"
          >
            Submit
          </v-btn>
        </v-row>
      </v-col>
    </v-form>
  </div>
</template>

<script>
  export default {
    name: 'ContactForm',
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        valid: false,
        name: '',
        message: '',
        email: '',
        phoneNumber: '',
        isSaving: false,
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => v.length <= 24 || 'Name must be less than 24 characters',
        ],
        messageRules: [
          (v) => !!v || 'Message is required',
          (v) => v.length <= 200 || 'Message must be less than 200 characters',
        ],
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        phoneNumberRules: [
          (v) => !!v || 'Phone Number is required',
          v => Number.isInteger(Number(v)) || "Phone number must be valid"
        ],
        isSuccess: false,
        isMobile: false
      }
    },
    methods: {
      onSubmit() {
        const formData = new FormData();
        formData.append('name', this.name)
        formData.append('email', this.email)
        formData.append('message', this.message)
        formData.append('phoneNumber', this.phoneNumber)
        this.isSaving = true
        this.$axios.post(this.user.api_url, formData, {
          headers: {
            Accept: 'application/json'
          },
        }).then((response) => {
          this.isSuccess = true
          this.isSaving = false
        }).catch((e) => {
          console.log(e, 'failed')
          this.isSuccess = false
          this.isSaving = false
        })
        this.isSaving = false
      }
    }
  }
</script>
