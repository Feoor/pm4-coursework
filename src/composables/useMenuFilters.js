import { ref, computed } from 'vue';

export function useMenuFilters(initialRestaurants, initialDishes) {
  const searchQuery = ref('');
  const selectedCategories = ref([]);
  const selectedSortOption = ref('rating');
  const selectedGroup = ref('all')
  const maxPrice = ref(15000);

  const filteredDishes = computed(() => {
    if (selectedGroup.value !== 'all' && selectedGroup.value !== 'dishes') {
      return [];
    }

    // Фильтруем блюда на основе поискового запроса, выбранной категории и максимальной цены
    let result = initialDishes.value.filter(dish => {
      const matchesSearchQuery = dish.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.some(category => dish.categories.includes(category));
      const matchesPrice = dish.price <= maxPrice.value;

      return matchesSearchQuery && matchesCategory && matchesPrice;
    })
    
    // Сортируем отфильтрованные блюда на основе выбранного параметра сортировки
    return result.sort((a, b) => {
      const options = {
        'fast-delivery': () => a.deliveryTime - b.deliveryTime,
        'popularity': () => b.popularity - a.popularity,
        'rating': () => b.rating - a.rating,
        'price-low-high': () => a.price - b.price,
        'price-high-low': () => b.price - a.price
      }

      return options[selectedSortOption.value] ? options[selectedSortOption.value]() : [];
    });
  });

  const filteredRestaurants = computed(() => {
    if (selectedGroup.value !== 'all' && selectedGroup.value !== 'restaurants') {
      return [];
    }

    let result = initialRestaurants.value.filter(restaurant => {
      const matchesSearchQuery = restaurant.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.some(category => restaurant.categories.includes(category));

      return matchesSearchQuery && matchesCategory;
    })
    
    return result.sort((a, b) => {
      const options = {
        'fast-delivery': () => a.deliveryTime - b.deliveryTime,
        'popularity': () => b.popularity - a.popularity,
        'rating': () => b.rating - a.rating,
      }

      return options[selectedSortOption.value] ? options[selectedSortOption.value]() : [];
    });
  });

  const toggleCategory = (category) => {
    const index = selectedCategories.value.indexOf(category);
    if (index === -1) {
      selectedCategories.value.push(category);
    } else {
      selectedCategories.value.splice(index, 1);
    }
  }

  const isCategorySelected = (category) => {
    return selectedCategories.value.includes(category);
  }

  return {
    // Variables
    searchQuery,
    selectedCategories,
    selectedSortOption,
    selectedGroup,
    maxPrice,

    // Computed
    filteredDishes,
    filteredRestaurants,

    // Methods
    toggleCategory,
    isCategorySelected
  }
}