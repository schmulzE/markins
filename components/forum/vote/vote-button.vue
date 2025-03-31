<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Database } from 'types/database.types';

const props = defineProps<{
  targetId: string
  targetType: 'post' | 'comment'
}>()

const upvotes = ref(0);
const downvotes = ref(0);
const user = useSupabaseUser();
const userVote = ref<number | null>(null);
const client = useSupabaseClient<Database>();

onMounted(async () => {
  await fetchVotes()
})

async function fetchVotes() {
  const { data: votesData, error } = await client
    .from('votes')
    .select('vote_type, profile_id')
    .eq('target_id', props.targetId)
    .eq('target_type', props.targetType)

  if (error) {
    throw error
  }

  upvotes.value = votesData.filter((v: { vote_type: number; }) => v.vote_type === 1).length
  downvotes.value = votesData.filter((v: { vote_type: number; }) => v.vote_type === -1).length

  const userVoteData = votesData.find((v: { profile_id: string | null; }) => v.profile_id === user.value?.id)
  userVote.value = userVoteData ? userVoteData.vote_type : null
}

const totalVotes = computed(() => {
  return upvotes.value + downvotes.value
});

async function vote(voteType: number) {
  if (!user.value) {
    alert('Please log in to vote')
    return
  }

  const { error } = await $fetch<{ error?: string }>('/api/votes', {
    method: 'POST',
    body: {
      profile_id: user.value.id,
      target_id: props.targetId,
      target_type: props.targetType,
      vote_type: voteType,
    },
  })

  if (error) {
    throw error
  }

  await fetchVotes()
}
</script>


<template>
  <div>
    <button 
    class="disabled:cursor-not-alowed btn btn-circle btn-xs bg-transparent hover:bg-transparent border-none"
    @click="vote(1)" 
    >
      <span :class="{ 'bg-blue-600 i-mdi-arrow-up-bold': userVote === 1, 'bg-slate-400 i-mdi-arrow-up-bold-outline': userVote !== 1}" class=" text-3xl inline-block" />
    </button>
    <span class="text-md font-bold text-center block">{{ totalVotes }}</span>
    <button 
    class="disabled:cursor-not-allowed btn btn-xs btn-circle bg-transparent hover:bg-transparent border-none"
    @click="vote(-1)" 
    >
      <span :class="{ 'bg-blue-600 i-mdi-arrow-down-bold': userVote === -1, 'bg-slate-400 i-mdi-arrow-down-bold-outline': userVote !== -1}" class="text-3xl inline-block bg-slate-400" />
    </button>
  </div>
</template>
