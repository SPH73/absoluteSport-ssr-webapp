<script setup>
const { data: fList, error, pending } = await useFetch("/api/faqs");
const faqList = ref([]);
let faq = {};
// console.log("faqs", faqList.value);
fList.value.forEach((record, index) => {
  faq = {
    index: index + 1,
    id: record.id,
    question: record.fields.question,
    answer: record.fields.answer,
    tags: record.fields.tags,
  };
  faqList.value.push(faq);
});

const showFaqs = ref(false);
const search = ref("");
const selectedTag = ref(null);
const clearTag = () => {
  selectedTag.value = null;
};

const clearInput = () => {
  search.value = "";
};

const showFaqList = () => {
  showFaqs.value = true;
  selectedTag.value = null;
  search.value = "";
};
const hideFaqList = () => {
  showFaqs.value = false;
};

const clearFilters = () => {
  clearTag();
  clearInput();
  hideFaqList();
};

const selectTag = tag => {
  return (selectedTag.value = tag);
};

const matchingFAQs = computed(() => {
  clearTag();
  return faqList.value.filter(faq => faq.question.includes(search.value));
});
// watch(matchingFAQs, () => console.log(matchingFAQs.value));
const filteredFAQs = computed(() => {
  clearInput();
  return faqList.value.filter(faq => faq.tags.includes(selectedTag.value));
});
</script>
<template>
  <div>
    <section class="bg-secondary flex flex-col justify-center items-center">
      <div class="max-w-6xl my-8">
        <h2 class="font-play text-4xl">Frequently Asked Question's</h2>
        <p>Filter by search or tag or browse the list of FAQ's</p>
        <input
          class="w-full h-12 rounded-full py-2 pl-9 pr-3 placeholder:italic placeholder:text-slate-400"
          type="text"
          v-model="search"
          placeholder="Search..."
        />
        <p v-if="search.length">
          Searching any FAQ's that include the term "{{ search }}"
        </p>

        <div v-if="error">{{ error }}</div>
        <div v-if="faqList.length">
          <FaqTagCloud
            :faqs="faqList"
            @select-tag="selectTag"
            :selected-tag="selectedTag"
          />
          <div v-if="selectedTag" id="selected-tag">
            <p class="m-auto inline-block">
              Searching all Faq's tagged with #{{ selectedTag }}
            </p>
          </div>
        </div>
        <!-- <div v-else>
            <TheSpinner></TheSpinner>
          </div> -->
        <div class="btn-group mt-4">
          <button class="btn-accent mr-4" @click="clearFilters">
            Clear All
          </button>
          <button class="btn-accent" v-if="showFaqs" @click="hideFaqList">
            Hide All
          </button>
          <button class="btn-accent" v-else @click="showFaqList">
            Show All
          </button>
        </div>
      </div>
    </section>
    <section class="flex flex-col justify-center">
      <transition name="showFiltered">
        <div v-if="selectedTag">
          <div v-if="filteredFAQs.length">
            <FaqTagSearch :filteredFAQs="filteredFAQs" />
          </div>
          <div v-else>
            <p>Oops! We seem to be having a problem searching that tag...</p>
          </div>
        </div>
        <div v-else-if="search.length">
          <div v-if="matchingFAQs.length">
            <FaqInputSearch :matchingFAQs="matchingFAQs" />
          </div>
          <div v-else>
            <p>
              Try a typing a different search term or phrase or use search by
              tag...
            </p>
          </div>
        </div>
      </transition>
      <transition name="showFaq">
        <div v-if="showFaqs && !search.length && !selectedTag">
          <div class="p-8 mx-auto max-w-6xl">
            <div v-if="error">
              <p>{{ error }}</p>
            </div>
            <div v-if="faqList.length">
              <BaseCard>
                <FaqList v-if="showFaqs" :faqList="faqList" />
              </BaseCard>
            </div>
            <div v-else>
              <TheSpinner />
            </div>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<style scoped>
@keyframes slide-out {
  0% {
    opacity: 0;
    transform: translateY(-110px) scale(0.9);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.showFaq-enter-active,
.showFiltered-enter-active {
  animation: slide-out 0.5s ease-in-out;
}

.showFaq-leave-active,
.showFiltered-leave-active {
  animation: slide-out 0.5s ease-in-out reverse;
}
</style>
