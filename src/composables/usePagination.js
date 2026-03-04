import { ref, computed } from 'vue';

export function usePagination(fetchFn, countFn, pageSize = 5, batchSize = 10) {
  const items = ref([]); // Локальный кэш
  const currentPage = ref(1);
  const lastDoc = ref(null); // Курсор для Firestore
  const totalCount = ref(0);
  const isLoading = ref(false);

  // Получаем общее количество документов в коллекции
  const fetchTotalCount = async () => {
    totalCount.value = await countFn();
  };

  // Подгрузка следующей пачки данных
  const loadNextBatch = async (nextBatchSize = batchSize) => {
    if (isLoading.value) return; // Предотвращаем одновременные загрузки
    isLoading.value = true;

    try {
      const result = await fetchFn({
        lastVisible: lastDoc.value,
        nextBatchSize,
       });

      items.value.push(...result.items);
      lastDoc.value = result.lastVisible; // Обновляем курсор для следующей загрузки
    } finally {
      isLoading.value = false;
    }
  }

  // Получение данных для текущей страницы
  const displayedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = currentPage.value * pageSize;

    // Если данных для текущей страницы недостаточно, подгружаем следующую пачку
    if (endIndex > items.value.length && items.value.length < totalCount.value) {
      loadNextBatch();
    }

    return items.value.slice(startIndex, endIndex);
  });

  // Логика переключения страниц
  const nextPage = async () => {
    if (!(currentPage.value * pageSize < totalCount.value)) {
      return;
    }

    currentPage.value++;
    // Если данных для следующей страницы недостаточно, подгружаем следующую пачку
    const nextItemsNeeded = currentPage.value * pageSize;
    if (items.value.length < nextItemsNeeded + pageSize && items.value.length < totalCount.value) {
      console.log('Loading next batch of data...');
      await loadNextBatch();
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }

  const goToPage = async (page) => {
    if (page < 1 || page > Math.ceil(totalCount.value / pageSize)) {
      return;
    }

    currentPage.value = page;

    // Если данных для выбранной страницы недостаточно, подгружаем следующую пачку
    const itemsNeeded = currentPage.value * pageSize;
    const itemsToLoad = itemsNeeded - items.value.length;
    if (itemsToLoad > 0 && items.value.length < totalCount.value) {
      console.log('Loading next batch of data...');
      await loadNextBatch(Math.max(itemsToLoad, batchSize));
    }
  }

  // Инициализация: получаем общее количество документов при первом вызове
  fetchTotalCount().catch(console.error);

  return { displayedItems, nextPage, prevPage, goToPage, totalCount, currentPage, isLoading };
}