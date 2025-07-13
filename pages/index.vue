<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
    <HeaderHomepageHeader />
    <HomepageHeroSection :is-visible="isVisible"/>
    <HomepageFeatures :is-visible="isVisible" :science-categories="scienceCategories" :features="features"/>
    <HomepageCommunity :is-visible="isVisible"/>
    <HomepageBlog :is-visible="isVisible" :blog-posts="blogPosts"/>
    <HomepageCallToAction :is-visible="isVisible"/>
    <HomepageFooter/>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {

  setup() {
    const isVisible = ref(false);

    onMounted(() => {
      isVisible.value = true;
    });

    const features = [
      {
        icon: 'i-lucide-message-square',
        title: "Post & Discuss",
        description: "Share your research, ask questions, and engage in meaningful scientific discussions",
      },
      {
        icon: 'i-lucide-thumbs-up',
        title: "Vote & Rank",
        description: "Community-driven content curation through upvoting and downvoting",
      },
      {
        icon: 'i-lucide-share-2',
        title: "Share Knowledge",
        description: "Easily share discoveries and insights across social platforms",
      },
      {
        icon: 'i-lucide-users',
        title: "Join Communities",
        description: "Connect with researchers, students, and science enthusiasts worldwide",
      },
    ];

    const blogPosts = [
      {
        title: "Breakthrough in Quantum Computing: New Qubit Stability Record",
        excerpt: "Researchers achieve 99.9% fidelity in quantum state preservation, marking a significant milestone...",
        author: "Dr. Sarah Chen",
        date: "2 days ago",
        category: "Physics",
        votes: 234,
        comments: 45,
        image: '/images/dr_sarah_chen.jpg'
      },
      {
        title: "CRISPR 3.0: Enhanced Gene Editing with Minimal Off-Target Effects",
        excerpt: "Latest developments in gene editing technology promise safer therapeutic applications...",
        author: "Prof. Michael Rodriguez",
        date: "4 days ago",
        category: "Biology",
        votes: 189,
        comments: 32,
        image: '/images/prof_michael_rodriguez.jpg'
      },
      {
        title: "Climate Models Predict Accelerated Arctic Ice Loss",
        excerpt: "New computational models suggest faster than expected changes in polar ice coverage...",
        author: "Dr. Emma Thompson",
        date: "1 week ago",
        category: "Climate Science",
        votes: 156,
        comments: 78,
        image: '/images/dr_emma_thompson.jpg'
      },
    ];

    const scienceCategories = [
      { icon: 'i-lucide-atom', name: "Physics", count: "12.5K" },
      { icon: 'i-lucide-dna', name: "Biology", count: "8.3K" },
      { icon: 'i-lucide-calculator', name: "Mathematics", count: "6.7K" },
      { icon: 'i-lucide-beaker', name: "Chemistry", count: "5.2K" },
      { icon: 'i-lucide-telescope', name: "Astronomy", count: "4.1K" },
      { icon: 'i-lucide-zap', name: "Engineering", count: "7.8K" },
    ];

    return {
      isVisible,
      features,
      blogPosts,
      scienceCategories,
    };
  },
};
</script>