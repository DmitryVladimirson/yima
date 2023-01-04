<template>
  <div class="container ">
    index

    <FormKit type="form" :actions="false">
      <FormKit
        type="date"
        placeholder="enter text"
        name="text"
        help="da"
        label="net"
        validation="length:6"
      />

      <FormKit
        type="radio"
        label="Preferred transportation"
        :options="['E-Bike', 'E-Scooter', 'Electric car', 'Walking', 'Space tube']"
        help="How do you like to get around?"
      />
    </FormKit>
    <FormKit
      v-model="value"
      type="checkbox"
      label="Toppings"
      :options="['Mushrooms', 'Olives', 'Salami', 'Anchovies']"
      decorator-icon="happy"
      help="Select your pizza toppings"
      validation="required|min:3"
    />

    <button class="btn btn-primary">
      btn
    </button>

    <FormKit type="select">
      <option disabled selected>
        Pick your favorite Simpson
      </option>
      <option>Homer</option>
      <option>Marge</option>
      <option>Bart</option>
      <option>Lisa</option>
      <option>Maggie</option>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
</script>
