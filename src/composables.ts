import { onMounted, ref, watch } from "vue";

export function useLocalStorage<Type>(key: string, defaultValue: Type) {
  const data = ref(defaultValue);

  onMounted(() => {
    const item = localStorage.getItem(key);
    data.value = item !== null ? JSON.parse(item) as Type : defaultValue;
  });

  watch(data, (dataValue) => {
    console.log(dataValue);
    localStorage.setItem(key, JSON.stringify(dataValue));
  });

  return data;
}
