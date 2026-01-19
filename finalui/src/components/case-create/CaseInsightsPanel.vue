<template>
  <div class="space-y-6">
    <!-- AI Title Badge (Shown when expanded) -->
    <div 
      class="rounded-xl shadow-lg border p-5 transition-all duration-200"
      :class="isDarkMode ? 'bg-neutral-900 border-transparent' : 'bg-white border-transparent'"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500">
          <i-mdi-robot class="w-5 h-5" />
        </div>
        <div>
          <h3 
            class="text-sm font-bold leading-none mb-1"
            :class="isDarkMode ? 'text-amber-500' : 'text-amber-600'"
          >
            Insights Active
          </h3>
          <p class="text-[10px] font-medium text-gray-500 leading-none">
            Processing real-time analytics
          </p>
        </div>
      </div>
    </div>

    <!-- Audio Upload Section - Shows when AI is enabled -->
    <div 
      v-if="aiEnabled"
      class="rounded-xl shadow-lg border p-6 transition-all duration-200"
      :class="isDarkMode ? 'bg-neutral-900 border-transparent' : 'bg-white border-transparent'"
    >
      <h3 
        class="text-sm font-bold mb-4"
        :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'"
      >
        Call Recording
      </h3>

      <!-- Upload State -->
      <div 
        v-if="!audioFile"
        class="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300"
        :class="isDarkMode 
          ? 'border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-800/50' 
          : 'border-gray-100 hover:border-amber-600/50 hover:bg-gray-50'"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden" 
          accept="audio/*"
          @change="handleFileSelect"
        />
        <div class="flex flex-col items-center gap-1">
          <p class="text-sm font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            Upload Audio
          </p>
          <p class="text-xs text-gray-500 font-medium">
            Drag files or click to browse
          </p>
        </div>
      </div>

      <!-- Player State -->
      <div v-else class="space-y-4">
        <div 
          class="flex items-center gap-4 p-4 rounded-xl border"
          :class="isDarkMode ? 'bg-black/40 border-neutral-800' : 'bg-gray-50 border-gray-100'"
        >
          <div class="flex-1 min-w-0">
            <p 
              class="text-sm font-bold truncate mb-0.5"
              :class="isDarkMode ? 'text-white' : 'text-gray-900'"
            >
              {{ audioFile.name }}
            </p>
            <p class="text-[11px] font-medium text-gray-500">
              {{ formatFileSize(audioFile.size) }}
            </p>
          </div>
          <button 
            @click="removeAudio"
            class="px-3 py-1.5 text-[11px] font-bold border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            Remove
          </button>
        </div>
        
        <audio controls class="w-full h-8 opacity-90 custom-audio-player" :src="audioUrl"></audio>
      </div>
    </div>

    <!-- Results Section (Insights & Feedback) -->
    <div 
      v-if="aiEnabled && audioFile"
      class="rounded-xl shadow-lg border overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
      :class="isDarkMode ? 'bg-neutral-900 border-transparent' : 'bg-white border-transparent'"
    >
      <!-- Mode Selector Tabs (Segmented Control Layout) -->
      <div class="p-1 px-5 pt-5">
        <div class="flex p-1 rounded-xl" :class="isDarkMode ? 'bg-black/40' : 'bg-gray-100/50'">
          <button 
            @click="activeMode = 'insights'"
            class="flex-1 py-2 text-sm font-semibold transition-all duration-300 rounded-lg"
            :class="activeMode === 'insights' 
              ? (isDarkMode ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-amber-600 text-white shadow-md shadow-amber-600/20')
              : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')"
          >
            Insights
          </button>
          <button 
            @click="activeMode = 'feedback'"
            class="flex-1 py-2 text-sm font-semibold transition-all duration-300 rounded-lg"
            :class="activeMode === 'feedback' 
              ? (isDarkMode ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-amber-600 text-white shadow-md shadow-amber-600/20')
              : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')"
          >
            Feedback
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-6">
        <!-- AI Insights View -->
        <div v-if="activeMode === 'insights'" class="space-y-6 animate-in fade-in transition-all duration-300">
          <div class="flex items-center justify-between">
            <h4 
              class="text-sm font-bold flex items-center gap-2"
              :class="isDarkMode ? 'text-white' : 'text-gray-900'"
            >
              Summary
            </h4>
            <div class="px-2.5 py-1 rounded-md text-[10px] font-bold"
              :class="isDarkMode ? 'bg-amber-600/20 text-amber-500 border border-amber-600/30' : 'bg-amber-50 text-amber-700 border border-amber-200'">
              Confidence {{ (mockData.classification.confidence * 100).toFixed(0) }}%
            </div>
          </div>

          <p 
            class="text-xs leading-relaxed font-semibold"
            :class="isDarkMode ? 'text-white' : 'text-gray-900'"
          >
            {{ mockData.case_summary.narrative }}
          </p>

          <!-- Key Entities -->
          <div class="grid grid-cols-1 gap-4">
            <div class="p-4 rounded-xl border" :class="isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-gray-50 border-gray-100'">
              <span class="text-[11px] font-bold text-amber-600 block mb-3">Participants</span>
              <div class="flex flex-wrap gap-x-6 gap-y-2">
                <div class="flex flex-col gap-0.5">
                  <span class="text-[10px] font-bold text-gray-500 tracking-tight">Counsellor</span>
                  <span class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ mockData.participants.counsellor.join(', ') }}</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span class="text-[10px] font-bold text-gray-500 tracking-tight">Victim</span>
                  <span class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ mockData.participants.victim.join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Transcript Section -->
          <div>
            <h4 class="text-[11px] font-bold text-gray-500 mb-3">Translation</h4>
            <div class="p-5 rounded-2xl border italic text-xs leading-relaxed font-medium" 
              :class="isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-gray-100 text-gray-900 shadow-sm'">
              "{{ mockData.caller_interaction.translation.text }}"
            </div>
          </div>
        </div>

        <!-- AI Feedback View -->
        <div v-if="activeMode === 'feedback'" class="space-y-6 animate-in fade-in transition-all duration-300">
          <!-- Rating Section -->
          <div class="p-6 rounded-2xl border border-dashed text-center">
            <h4 class="text-sm font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Review AI Accuracy</h4>
            
            <!-- Rating Dots -->
            <div class="flex items-center justify-center gap-3 mb-6">
              <button 
                v-for="star in 5" 
                :key="star"
                @click="rating = star"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="transition-all duration-200 transform hover:scale-110 focus:outline-none"
              >
                <div 
                  class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                  :class="(hoverRating || rating) >= star 
                    ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' 
                    : (isDarkMode ? 'border-neutral-700 text-neutral-500' : 'border-gray-200 text-gray-300')"
                >
                  {{ star }}
                </div>
              </button>
            </div>

            <!-- Conditional Feedback Input & Actions -->
            <div v-if="rating > 0" class="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <textarea 
                v-if="rating < 4"
                v-model="feedbackComment"
                rows="2"
                placeholder="What was incorrect?"
                class="w-full rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all border"
                :class="isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-white border-gray-100 text-gray-900 shadow-sm'"
              ></textarea>
              
              <div v-if="!feedbackSubmitted" class="flex justify-center">
                <button 
                  @click="submitFeedback"
                  :disabled="isSubmittingFeedback || (rating < 4 && !feedbackComment.trim())"
                  class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-600/20"
                >
                  <span v-if="isSubmittingFeedback" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {{ rating >= 4 ? 'Confirm Accuracy' : 'Submit Feedback' }}
                </button>
              </div>

              <div v-else class="text-amber-500 text-xs font-bold animate-in zoom-in-95 flex items-center justify-center gap-2">
                <i-mdi-check-circle class="w-4 h-4" />
                Feedback Recorded
              </div>
            </div>
          </div>

          <!-- Analysis Detail Section -->
          <div class="space-y-4">
            <!-- Classification & Risk -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-4 rounded-xl border flex flex-col" :class="isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-white border-gray-100 shadow-sm'">
                <span class="text-[11px] font-bold text-amber-600 block mb-3">Classification</span>
                <div class="space-y-3">
                  <div class="flex flex-col border-b border-dashed pb-2" :class="isDarkMode ? 'border-neutral-800' : 'border-gray-100'">
                    <span class="text-[8px] text-gray-500 uppercase font-bold tracking-tighter mb-0.5">Main Category</span>
                    <span class="text-[11px] font-bold leading-tight" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ mockData.classification.main_category }}</span>
                  </div>
                  <div class="flex flex-col border-b border-dashed pb-2" :class="isDarkMode ? 'border-neutral-800' : 'border-gray-100'">
                    <span class="text-[8px] text-gray-500 uppercase font-bold tracking-tighter mb-0.5">Sub Category</span>
                    <span class="text-[11px] font-bold leading-tight" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ mockData.classification.sub_category }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[9px] text-gray-500 font-bold mb-0.5">Intervention</span>
                    <span class="text-[11px] font-bold leading-tight" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ mockData.classification.intervention }}</span>
                  </div>
                </div>
              </div>
              
              <div class="p-4 rounded-xl border flex flex-col" :class="isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-white border-gray-100 shadow-sm'">
                <span class="text-[11px] font-bold text-amber-600 block mb-3">Risk Factor</span>
                <div class="flex-1 flex flex-col justify-center items-center text-center">
                  <div 
                    class="px-3 py-1.5 rounded-lg mb-2 border"
                    :class="mockData.risk_assessment.risk_level === 'high' 
                      ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-500'"
                  >
                    <span class="text-xs font-bold">{{ mockData.risk_assessment.risk_level }}</span>
                  </div>
                  <span class="text-[10px] font-bold text-gray-400 capitalize">{{ mockData.risk_assessment.risk_indicators_found }} Indicators</span>
                </div>
              </div>
            </div>

            <!-- Entities Captured -->
            <div class="p-4 rounded-xl border" :class="isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-white border-gray-100 shadow-sm'">
              <span class="text-[11px] font-bold text-amber-600 block mb-4">Entities Captured</span>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <span class="text-[8px] text-gray-400 block uppercase font-bold tracking-tighter mb-2">People</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="person in mockData.entities.persons" :key="person" 
                      class="px-2 py-1 rounded-md text-[10px] font-bold border"
                      :class="isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-600'">
                      {{ person }}
                    </span>
                  </div>
                </div>
                <div>
                  <span class="text-[8px] text-gray-400 block uppercase font-bold tracking-tighter mb-2">Locations</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="loc in mockData.entities.locations" :key="loc" 
                      class="px-2 py-1 rounded-md text-[10px] font-bold border"
                      :class="isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-600'">
                      {{ loc }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quality Stats -->
            <div class="space-y-3">
              <h4 class="text-[11px] font-bold text-gray-500 ml-1">Compliance Check</h4>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="(status, metric) in mockData.qa_scoring" :key="metric"
                  class="p-2 px-3 rounded-xl border flex items-center justify-between"
                  :class="isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-white border-gray-50 shadow-sm'">
                  <span class="text-[10px] font-medium text-gray-500 capitalize tracking-tight">{{ metric.replace('_', ' ') }}</span>
                  <span 
                    class="text-[9px] font-bold uppercase" 
                    :class="status === 'pass' ? 'text-green-500' : 'text-red-500'"
                  >
                    {{ status }}
                  </span>
                </div>
              </div>
              
              <div class="p-3 rounded-xl border border-dashed flex justify-between items-center bg-gray-50/30 dark:bg-black/10" :class="isDarkMode ? 'border-neutral-800' : 'border-gray-100'">
                <span class="text-[10px] font-bold text-gray-400">Overall Score</span>
                <span class="text-xs font-bold" :class="isDarkMode ? 'text-amber-500' : 'text-amber-600'">
                  {{ (mockData.quality_assurance.metrics.pass_rate * 100).toFixed(0) }}% Success Rate
                </span>
              </div>
            </div>

            <!-- Audit Trail -->
            <div class="pt-6 border-t border-dashed" :class="isDarkMode ? 'border-neutral-800' : 'border-gray-100'">
              <div class="grid grid-cols-2 gap-4 text-[8px] font-bold uppercase tracking-wider">
                <div class="space-y-1">
                  <span class="text-gray-400 block mb-1">Engines Involved</span>
                  <p :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'" class="leading-relaxed normal-case font-medium text-[9px]">
                    {{ mockData.ai_processing.models_used.join(', ') }}
                  </p>
                  <div class="flex gap-2 pt-1">
                    <span class="px-1.5 py-0.5 rounded border border-amber-500/20 text-amber-500 font-bold tracking-tight">{{ mockData.status }}</span>
                    <span class="px-1.5 py-0.5 rounded border border-gray-500/20 text-gray-500 font-bold tracking-tight">{{ mockData.site_id }}</span>
                  </div>
                </div>
                <div class="text-right space-y-1">
                  <span class="text-gray-400 block mb-1">System Trace</span>
                  <p :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'" class="font-medium tracking-tighter text-[9px]">
                    #{{ mockData.case_id }}
                  </p>
                  <p class="text-gray-500">
                    {{ mockData.audit.source }} / {{ mockData.audit.direction }}
                  </p>
                  <p class="text-[7px] text-gray-400 mt-2 font-medium">
                    Processing: {{ mockData.ai_processing.processing_time_seconds.toFixed(1) }}s • {{ new Date(mockData.completed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
  aiEnabled: {
    type: Boolean,
    default: false
  }
})

const isDarkMode = inject('isDarkMode')
const activeMode = ref('insights')
const rating = ref(0)
const hoverRating = ref(0)
const feedbackComment = ref('')
const isSubmittingFeedback = ref(false)
const feedbackSubmitted = ref(false)

const submitFeedback = () => {
  if (isSubmittingFeedback.value) return
  
  isSubmittingFeedback.value = true
  
  // Simulate API call
  setTimeout(() => {
    isSubmittingFeedback.value = false
    feedbackSubmitted.value = true
    import('vue-sonner').then(({ toast }) => {
      toast.success('Thank you for your feedback!')
    })
  }, 800)
}

const fileInput = ref(null)
const audioFile = ref(null)
const audioUrl = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('audio/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  audioFile.value = file
  audioUrl.value = URL.createObjectURL(file)
}

const removeAudio = () => {
  audioFile.value = null
  audioUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
  rating.value = 0
  feedbackComment.value = ''
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Data from User Request
const mockData = {
  "case_id": "1768420272.211",
  "site_id": "dev-site-001",
  "processing_mode": "post_call",
  "status": "completed",
  "created_at": "2026-01-14T19:16:13.451Z",
  "completed_at": "2026-01-14T19:16:15.583Z",

  "caller_interaction": {
    "primary_language": "sw",
    "translated_language": "en",
    "transcript": {
      "language": "sw",
      "text": "Hello. Hello. Yes, how are you? Good evening... (full transcript omitted for brevity)"
    },
    "translation": {
      "language": "en",
      "text": "Hello, hello, yes, how are you speaking to Amira from Child Healthline about a case of child abuse involving a child in Ngarongwe. The situation is urgent and requires immediate attention from the child protection services. We are coordinating with local authorities to ensure the child is safe and the perpetrators are handled according to the law.",
      "length": 2501
    }
  },

  "participants": {
    "counsellor": ["Amira"],
    "victim": ["Ivan Sumo"],
    "other_mentions": ["Na"]
  },

  "location": {
    "mentioned_locations": ["Asedia", "Ngarongwe", "Nganongwe"],
    "country_context": "Kenya"
  },

  "case_summary": {
    "narrative": "Ivan Sumo is speaking to Amira from Child Healthline about a case of child abuse involving a child in Ngarongwe, in Nganongwe. The caller expressed deep concern about the safety of the minor and requested guidance on legal steps to report the abuse to the regional child protection office.",
    "complexity": "low"
  },

  "classification": {
    "main_category": "Advice and Counselling",
    "sub_category": "Drug/Alcohol Abuse",
    "sub_category_2": "Feeding & Food Preparation",
    "intervention": "Counselling",
    "priority": 2,
    "confidence": 0.637
  },

  "risk_assessment": {
    "risk_level": "medium",
    "risk_indicators_found": 1,
    "confidence": 0.637
  },

  "entities": {
    "persons": ["Ivan Sumo", "Amira"],
    "locations": ["Asedia"],
    "organizations": [],
    "dates": []
  },

  "quality_assurance": {
    "overall_quality": "needs_improvement",
    "metrics": {
      "total_evaluated": 17,
      "passed": 0,
      "failed": 17,
      "pass_rate": 0.0
    }
  },

  "qa_scoring": {
    "opening": "pass",
    "listening": "pass",
    "proactiveness": "pass",
    "resolution": "pass",
    "hold_procedure": "pass",
    "closing": "pass"
  },

  "ai_processing": {
    "models_used": [
      "whisper",
      "translator",
      "ner",
      "classifier",
      "summarizer",
      "all-qa-distilbert-v1"
    ],
    "processing_time_seconds": 63.47
  },

  "audit": {
    "source": "gateway",
    "direction": "inbound",
    "mime_type": "application/json"
  }
}
</script>
