<script setup>
// Icons
import { Star } from '@lucide/vue';

const props = defineProps({
  review: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="review-card">
    <div class="review-card__header d-flex">
      <img :src="review.image" :alt="review.name" class="review-card__author-img">

      <div class="review-card__info">
        <h5 class="review-card__author">{{ review.name }}</h5>
        <p class="review-card__slogan">{{ review.slogan }}</p>
      </div>

    </div>

    <div class="review-card__body">
      <p class="review-card__text">
        "{{ review.text }}"
      </p>

      <div class="flex align-items-center mt-3">
          <Star v-for="i in review.rating" :key="i" size="24" fill="#FDCC0D" strokeWidth="0"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.review-card {
  min-width: 530px;
  padding: 38px 43px;
  border: 2px solid rgba(108, 95, 188, 0.2);
  border-radius: 14px;
  scroll-snap-align: start;

  .review-card__header {
    margin-bottom: 20px;

    img {
      width: 71px;
      height: 71px;
      border-radius: 50%;
      object-fit: cover;
    }

    .review-card__info {
      margin-left: 20px;
    }

    .review-card__author {
      font-family: $font-family, sans-serif;
      font-weight: 500;
      font-size: 20px;
      line-height: 150%;
      color: #030314;
    }

    .review-card__slogan {
      font-family: $font4, sans-serif;
      font-weight: 500;
      font-size: 16px;
      line-height: 156%;
      text-transform: capitalize;
      color: #5e5d5d;
    }
  }

  .review-card__text {
    font-family: $font-family, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 1.4;
    color: #636363;
  }
}

@media screen and (max-width: 1199.98px) {

  // Планшеты в горизонтальной ориентации, Ipad Pro (>= 1024px)
  .review-card {
    min-width: 400px;
    padding: 20px 24px;

    .review-card__header {
      margin-bottom: 16px;

      img {
        width: 60px;
        height: 60px;
      }

      .review-card__info {
        margin-left: 12px;
      }

      .review-card__author {
        font-size: 18px;
      }

      .review-card__slogan {
        font-size: 15px;
        margin-bottom: 0;
      }
    }

    .review-card__text {
      font-size: 18px;
    }
  }
}

@media screen and (max-width: 767.98px) {

  // Телефоны в горизонтальной ориентации (>= 576px)
  .review-card {
    min-width: 100%;

    .review-card__header {
      img {
        width: 68px;
        height: 68px;
      }

      .review-card__author {
        font-size: 20px;
      }

      .review-card__slogan {
        font-size: 18px;
        margin-bottom: 0;
      }
    }
  }
}
</style>