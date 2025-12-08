type FaqItem = {
  tags?: string[];
};

export function useTags(faqList: FaqItem[] = []) {
  const tags = ref<string[]>([]);
  const tagSet = new Set<string>();

  faqList.forEach((item) => {
    item?.tags?.forEach((tag) => tagSet.add(tag));
  });

  tags.value = [...tagSet];

  return { tags };
}
