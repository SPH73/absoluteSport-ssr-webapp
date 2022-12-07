<script setup>

const firstName = ref("Sue");
const surname = ref("Holder");
const email = ref("new1@email.com")
const phone = ref("07833089559");
const postCode = ref("GU29 9FJ");
const info = ref("No");
const party = ref("Football Frenzy Party");
const childsName = ref("Nathan Holder");
const childsBirthday = ref("2023-03-11");
const childsAge = ref(10);
const partyDate1 = ref("2023-03-11");
const partyDate2 = ref("2023-03-18");
const partyStart = ref("16:00")
const partyLength = ref(2)
const numChildren = ref(15)
const recaptcha = ref("...");
const quoteRef = ref("")


async function handleSubmit() {
  const res = await $fetch('/api/parties/partyQuote', {
    method: 'post',
    body: {
      firstName: firstName.value,
      status: "new",
      enquiryType: "party",
      surname: surname.value,
      email: email.value,
      info: info.value,
      phone: phone.value,
      postCode: postCode.value,
      party: party.value,
      childsName: childsName.value,
      childsAge: childsAge.value,
      childsBirthday: childsBirthday.value,
      partyDate1: partyDate1.value,
      partyDate2: partyDate2.value,
      partyStart: partyStart.value,
      partyLength: partyLength.value,
      numChildren: numChildren.value,
      recaptcha: recaptcha.value
    }
  })
  console.log('Response', res)
  quoteRef.value = res.id
  console.log('quoteRef', quoteRef.value)
}

</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <label>First Name
        <input type="text" v-model="firstName" />
      </label>
      <label>Surname
        <input type="text" v-model="surname" />
      </label>
      <label>Email
        <input type="email" v-model="email" />
      </label>
      <label>Phone
        <input type="phone" v-model="phone" />
      </label>
      <label>Post Code
        <input type="text" v-model="postCode" />
      </label>
      <label>Childs Name
        <input type="text" v-model="childsName" />
      </label>
      <label>Childs Age
        <input type="text" v-model="childsAge" />
      </label>
      <label>Actual Birthday
        <input type="date" v-model="childsBirthday" />
      </label>
      <label>Party Date 1st Choice
        <input type="date" v-model="partyDate1" />
      </label>
      <label>Party Date 2nd Choice
        <input type="date" v-model="partyDate2" />
      </label>
      <label>Party Duration
        <input type="number" v-model="partyLength" />
      </label>
      <label>Party Start Time
        <input type="time" v-model="partyStart" />
      </label>
      <label>Number of Children
        <input type="number" v-model="numChildren" />
      </label>
      <label>Additonal Info?
        <textarea type="text" v-model="info" />
      </label><br>
      <button type="submit">Send Me A Quote</button>
    </form>
  </div>
</template>

