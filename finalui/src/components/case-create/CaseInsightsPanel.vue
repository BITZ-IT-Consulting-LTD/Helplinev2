<template>
  <div class="space-y-6">
    <!-- Audio Upload & Player Section -->
    <div 
      class="rounded-xl shadow-lg border p-6 transition-all duration-200"
      :class="isDarkMode ? 'bg-neutral-900 border-transparent' : 'bg-white border-transparent'"
    >
      <h3 
        class="text-lg font-bold mb-4 flex items-center gap-2"
        :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'"
      >
        <i-mdi-microphone class="w-5 h-5 text-amber-500" />
        Call Recording
      </h3>

      <!-- Upload State -->
      <div 
        v-if="!audioFile"
        class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
        :class="isDarkMode 
          ? 'border-transparent hover:border-blue-500 hover:bg-neutral-800' 
          : 'border-transparent hover:border-blue-500 hover:bg-gray-50'"
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
        <div class="flex flex-col items-center gap-2">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <i-mdi-cloud-upload class="w-6 h-6" />
          </div>
          <p class="font-medium" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            Click to upload or drag audio
          </p>
          <p class="text-xs" :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">
            MP3, WAV, M4A up to 50MB
          </p>
        </div>
      </div>

      <!-- Player State -->
      <div v-else class="space-y-4">
        <div 
          class="flex items-center gap-3 p-3 rounded-xl border"
          :class="isDarkMode ? 'bg-gray-900 border-transparent' : 'bg-gray-50 border-transparent'"
        >
          <div class="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <i-mdi-music-note class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
              {{ audioFile.name }}
            </p>
            <p class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
              {{ formatFileSize(audioFile.size) }}
            </p>
          </div>
          <button 
            @click="removeAudio"
            class="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
          >
            <i-mdi-close class="w-5 h-5" />
          </button>
        </div>
        
        <audio controls class="w-full" :src="audioUrl"></audio>
      </div>
    </div>

    <!-- AI Insights Panel -->
    <div 
      class="rounded-xl shadow-lg border overflow-hidden transition-all duration-200"
      :class="isDarkMode ? 'bg-neutral-900 border-transparent' : 'bg-white border-transparent'"
    >
      <div class="p-4 border-b" :class="isDarkMode ? 'border-transparent bg-gray-900/50' : 'border-transparent bg-gray-50'">
        <div class="flex items-center justify-between mb-1">
          <h3 
            class="text-lg font-bold flex items-center gap-2"
            :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'"
          >
            <i-mdi-auto-fix class="w-5 h-5 text-purple-500" />
            AI Insights
          </h3>
          <span 
            class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
          >
            Confidence: {{ (mockData.classification.confidence.overall * 100).toFixed(1) }}%
          </span>
        </div>
        <p class="text-xs" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
          Processed in {{ mockData.timestamps.processing_time_seconds.toFixed(2) }}s
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Summary Section -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            <i-mdi-text-short class="w-4 h-4" /> Summary
          </h4>
          <p class="text-sm leading-relaxed" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            {{ mockData.summary.short_summary }}
          </p>
          <div class="flex gap-2 mt-3">
             <span class="px-2 py-1 rounded-md text-xs font-medium border" :class="isDarkMode ? 'bg-blue-900/20 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200'">
               Complexity: {{ mockData.summary.case_complexity }}
             </span>
             <span class="px-2 py-1 rounded-md text-xs font-medium border" :class="isDarkMode ? 'bg-purple-900/20 text-purple-300 border-purple-800' : 'bg-purple-50 text-purple-700 border-purple-200'">
               Lang: {{ mockData.summary.primary_language }}
             </span>
          </div>
        </div>

        <!-- Classification -->
        <div>
           <h4 class="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            <i-mdi-shape class="w-4 h-4" /> Classification
          </h4>
          <div class="space-y-2">
            <div class="p-3 rounded-xl border bg-gradient-to-r" 
              :class="isDarkMode ? 'from-gray-800 to-gray-750 border-transparent' : 'from-gray-50 to-white border-transparent'">
              <span class="text-xs text-gray-500 block mb-1">Main Category</span>
              <span class="font-semibold block" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                {{ mockData.classification.main_category }}
              </span>
            </div>
            <div class="p-3 rounded-xl border bg-gradient-to-r" 
               :class="isDarkMode ? 'from-gray-800 to-gray-750 border-transparent' : 'from-gray-50 to-white border-transparent'">
               <span class="text-xs text-gray-500 block mb-1">Sub Category</span>
               <span class="font-semibold block" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                {{ mockData.classification.sub_category }}
              </span>
            </div>
          </div>
        </div>

        <!-- Transcription & Translation -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            <i-mdi-translate class="w-4 h-4" /> Content ({{ mockData.call_content.language_detected.toUpperCase() }} → EN)
          </h4>
          
          <div class="space-y-3">
             <div class="p-3 rounded-xl rounded-tl-none border relative ml-2" :class="isDarkMode ? 'bg-neutral-800 border-transparent text-gray-300' : 'bg-gray-100 border-transparent text-gray-600'">
                <span class="absolute -top-2 -left-2 text-xs px-1 rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300">Original</span>
                <p class="text-xs italic">"{{ mockData.call_content.transcription.text }}"</p>
             </div>
             
             <div class="p-3 rounded-xl rounded-tr-none border relative mr-2" :class="isDarkMode ? 'bg-blue-900/20 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'">
                <span class="absolute -top-2 -right-2 text-xs px-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">En Translation</span>
                <p class="text-sm">"{{ mockData.call_content.translation.text }}"</p>
             </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div>
           <h4 class="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            <i-mdi-alert-circle class="w-4 h-4" /> Risk Assessment
          </h4>
          <div class="flex items-center gap-3 p-3 rounded-xl border" :class="isDarkMode ? 'bg-gray-900 border-transparent' : 'bg-gray-50 border-transparent'">
             <div class="h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg"
               :class="{
                 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400': mockData.risk_assessment.risk_level === 'low',
                 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400': mockData.risk_assessment.risk_level === 'medium',
                 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400': mockData.risk_assessment.risk_level === 'high'
               }">
               {{ mockData.risk_assessment.priority }}
             </div>
             <div>
                <p class="font-bold text-sm uppercase" :class="isDarkMode ? 'text-gray-200' : 'text-gray-800'">
                  {{ mockData.risk_assessment.risk_level }} Risk
                </p>
                <p class="text-xs text-gray-500">
                  Indicators found: {{ mockData.risk_assessment.risk_indicators_found }}
                </p>
             </div>
          </div>
        </div>

        <!-- QA Scores -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
            <i-mdi-clipboard-check class="w-4 h-4" /> QA Metrics (Auto)
          </h4>
          
          <div class="space-y-3">
             <div v-for="(metricGroup, groupName) in mockData.quality_assurance.scores" :key="groupName">
                <p class="text-[10px] uppercase font-bold text-gray-400 mb-1">{{ groupName }}</p>
                <div class="space-y-2">
                   <div v-for="(item, idx) in metricGroup" :key="idx" class="flex items-center justify-between text-xs">
                      <span :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ item.metric }}</span>
                      <div class="flex items-center gap-2">
                         <div class="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full rounded-full" 
                                 :class="item.passed ? 'bg-green-500' : 'bg-red-500'"
                                 :style="{ width: (item.probability * 100) + '%' }"></div>
                         </div>
                         <i-mdi-check-circle v-if="item.passed" class="w-3 h-3 text-green-500" />
                         <i-mdi-close-circle v-else class="w-3 h-3 text-red-500" />
                      </div>
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

const isDarkMode = inject('isDarkMode')
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
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Mock Data from User Request
const mockData = {
  "case_id": "1768572302.54",
  "version": "2.0",
  "site_id": "dev-site-001",
  "processing_mode": "post_call",
  "timestamps": {
    "call_received": "2026-01-16T14:00:23.937174+00:00",
    "processing_completed": "2026-01-16T14:00:24.992370+00:00",
    "processing_time_seconds": 14.21545
  },
  "call_content": {
    "language_detected": "sw",
    "transcription": {
      "text": "eeh kuna eeh kwa kifupi mzamo nakupigia simu kutoka moja moja sita kwa huduma kwa watoto kuripoti kuhusu mtoto anapapate shule nini kutokana na nyumba ambayo hajatoka kwenda shule kwa wiki mbili sasa aah wikimbili kwani aah na nyinyi ndio maana yeye ni shule aah wazazi wako wanafaa wakimfukuza nyumbani na haja hajaripo haria shule kwa hiyo si katika ofisi za watoto iliwe ndio kwa ripoti hii isi",
      "length": 408
    },
    "translation": {
      "source_language": "sw",
      "target_language": "en",
      "text": "Eeh there is an eeh for almost all time I'm calling you from one six to the child helpline to report what a child gets from school that hasn't been going to school for two weeks now aah is the same idea as school aaah your parents are working on at home and there are no schools available for that not in the children's offices but for this report.",
      "length": 348
    }
  },
  "entities": {
    "caller_expressions": ["##eh", "##eh", "##ah"],
    "entities_count": 1,
    "persons": [],
    "locations": [],
    "organizations": [],
    "dates": []
  },
  "classification": {
    "main_category": "Advice and Counselling",
    "sub_category": "School Related Issues",
    "sub_category_secondary": "School related issues",
    "intervention_required": "Referral",
    "priority": "2",
    "confidence": {
      "overall": 0.506,
      "breakdown": {
        "main_category": 0.31,
        "sub_category": 0.223,
        "secondary_sub_category": 0.185,
        "intervention": 0.645,
        "priority": 0.845
      }
    }
  },
  "summary": {
    "short_summary": "Caller reports a child who has not attended school for two weeks.",
    "case_complexity": "low",
    "primary_language": "multilingual"
  },
  "risk_assessment": {
    "risk_level": "low",
    "risk_indicators_found": 0,
    "priority": "2",
    "confidence": 0.506
  },
  "quality_assurance": {
    "overall_quality": "needs_improvement",
    "metrics": {
      "total_evaluated": 17,
      "passed": 0,
      "failed": 17,
      "pass_rate_percentage": 0.0
    },
    "scores": {
      "opening": [
        { "metric": "Use of call opening phrase", "passed": false, "probability": 0.4944 }
      ],
      "listening": [
        { "metric": "Caller was not interrupted", "passed": false, "probability": 0.8209 },
        { "metric": "Empathizes with the caller", "passed": false, "probability": 0.8151 }
      ],
      "proactiveness": [
        { "metric": "Willing to solve extra issues", "passed": false, "probability": 0.5875 }
      ],
      "resolution": [
        { "metric": "Explains solution process clearly", "passed": false, "probability": 0.7682 }
      ],
      "closing": [
        { "metric": "Proper call closing phrase used", "passed": false, "probability": 0.3675 }
      ]
    }
  },
  "ai_pipeline": {
    "models_used": ["whisper", "translator", "ner", "classifier", "summarizer", "all_qa_distilbert_v1"],
    "status": "completed"
  },
  "system_metadata": {
    "status": "success",
    "error": null,
    "ui_metadata": null
  }
}
</script>
