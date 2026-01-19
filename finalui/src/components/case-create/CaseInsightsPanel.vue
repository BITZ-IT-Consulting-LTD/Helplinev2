<template>
  <div class="space-y-6">
    <!-- AI Title Badge (Shown when expanded) -->
    <div 
      class="rounded-xl shadow-lg border p-5 transition-all duration-200"
      :class="isDarkMode ? 'bg-neutral-900 border-transparent' : 'bg-white border-transparent'"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
          :class="isDarkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-600/10 text-amber-600'"
        >
          <i-mdi-robot class="w-5 h-5" />
        </div>
        <div>
          <h3 
            class="text-base font-bold leading-none mb-1"
            :class="isDarkMode ? 'text-amber-500' : 'text-amber-600'"
          >
            Insights Active
          </h3>
          <p class="text-xs font-medium leading-none" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">
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
            class="flex-1 py-2 text-sm font-bold transition-all duration-300 rounded-lg"
            :class="activeMode === 'insights' 
              ? (isDarkMode ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-amber-700 text-white shadow-lg shadow-amber-900/40')
              : (isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700')"
          >
            Insights
          </button>
          <button 
            @click="activeMode = 'feedback'"
            class="flex-1 py-2 text-sm font-bold transition-all duration-300 rounded-lg"
            :class="activeMode === 'feedback' 
              ? (isDarkMode ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-amber-700 text-white shadow-lg shadow-amber-900/40')
              : (isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700')"
          >
            Feedback
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-6">
        <!-- AI Insights View -->
        <div v-if="activeMode === 'insights'" class="space-y-8 animate-in fade-in transition-all duration-300">
          
          <!-- 1. Situation Overview -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 
                class="text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                :class="isDarkMode ? 'text-amber-500/80' : 'text-amber-600/80'"
              >
                Situation Overview
              </h4>
              <div class="px-2 py-0.5 rounded text-[10px] font-bold"
                :class="isDarkMode ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'">
                AI GENERATED • {{ mockData.ai_metadata.model }}
              </div>
            </div>
            
            <div class="p-4 rounded-xl border border-dashed" :class="isDarkMode ? 'border-neutral-800 bg-neutral-900/40' : 'border-gray-200 bg-amber-50/10'">
              <p class="text-sm leading-relaxed font-bold italic mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                "{{ mockData.situation_overview.one_line_summary }}"
              </p>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-[10px] font-bold uppercase block mb-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Key Concerns</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="concern in mockData.situation_overview.key_concerns" :key="concern"
                      class="px-2 py-1 rounded-md text-xs font-bold"
                      :class="isDarkMode ? 'bg-neutral-800 text-white' : 'bg-white text-gray-800 shadow-sm'"
                    >
                      #{{ concern }}
                    </span>
                  </div>
                </div>
                <div>
                  <span class="text-[10px] font-bold uppercase block mb-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Population at Risk</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="pop in mockData.situation_overview.population_at_risk" :key="pop"
                      class="px-2 py-1 rounded-md text-xs font-bold"
                      :class="isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-700'"
                    >
                      {{ pop }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Risk Signals -->
          <div class="grid grid-cols-1 gap-3">
             <div class="p-4 rounded-xl border flex flex-col gap-3"
                :class="isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-white border-gray-100 shadow-sm'"
             >
                <div class="flex items-center justify-between">
                  <h4 class="text-[11px] font-bold uppercase tracking-widest" :class="isDarkMode ? 'text-amber-500/80' : 'text-amber-600/80'">Risk Signals</h4>
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter"
                    :class="mockData.risk_signals.priority_level === 'high' 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                      : 'bg-amber-500 text-black'"
                  >
                    Priority: {{ mockData.risk_signals.priority_level }}
                  </span>
                </div>
                
                <div class="flex items-center gap-4">
                  <div class="flex-1">
                    <span class="text-[10px] font-bold" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Urgency</span>
                    <div class="flex items-center gap-2">
                       <i-mdi-lightning-bolt class="w-4 h-4 text-amber-500 animate-pulse" />
                       <span class="text-sm font-bold uppercase tracking-wide" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                         {{ mockData.risk_signals.urgency_indicator }}
                       </span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <span class="text-[10px] font-bold" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Risk Flags</span>
                    <div class="flex flex-wrap gap-1.5">
                      <span v-for="flag in mockData.risk_signals.risk_flags" :key="flag"
                        class="text-xs font-bold text-red-500"
                      >
                        • {{ flag }}
                      </span>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <!-- 3. Suggested Actions -->
          <div class="space-y-4">
            <h4 class="text-[11px] font-bold uppercase tracking-widest" :class="isDarkMode ? 'text-amber-500/80' : 'text-amber-600/80'">Suggested Actions</h4>
            <div class="grid grid-cols-1 gap-3">
              <div v-for="(actions, type) in mockData.suggested_actions" :key="type" 
                class="p-4 rounded-xl border group transition-all"
                :class="[
                  isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-white border-gray-100 shadow-sm',
                  type === 'immediate' ? (isDarkMode ? 'border-amber-500/30 bg-amber-500/5' : 'border-amber-100 bg-amber-50/30') : ''
                ]"
              >
                <div class="flex items-center gap-2 mb-2">
                  <i-mdi-alert-circle v-if="type === 'immediate'" class="w-4 h-4 text-amber-500" />
                  <i-mdi-calendar-clock v-else-if="type === 'short_term'" class="w-4 h-4 text-blue-500" />
                  <i-mdi-refresh v-else class="w-4 h-4 text-emerald-500" />
                  <span class="text-[10px] font-bold text-gray-500 uppercase">{{ type.replace('_', ' ') }} Actions</span>
                </div>
                <ul class="space-y-1.5">
                  <li v-for="action in actions" :key="action" class="text-xs font-semibold leading-relaxed" :class="isDarkMode ? 'text-gray-300' : 'text-gray-800'">
                    • {{ action }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 4. Agent Guidance -->
          <div class="p-4 rounded-xl border border-dashed" :class="isDarkMode ? 'border-neutral-800 bg-neutral-900/40' : 'border-gray-200 bg-amber-50/5'">
            <h4 class="text-[11px] font-bold uppercase tracking-widest mb-4" :class="isDarkMode ? 'text-amber-500/80' : 'text-amber-600/80'">Agent Guidance</h4>
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-[9px] font-bold text-gray-500 uppercase block mb-2">Suggested Questions</span>
                  <div v-for="q in mockData.agent_guidance.suggested_questions" :key="q" class="text-[10px] font-bold leading-relaxed mb-1.5" :class="isDarkMode ? 'text-amber-500' : 'text-amber-700'">
                    "{{ q }}"
                  </div>
                </div>
                <div>
                  <span class="text-[9px] font-bold text-gray-500 uppercase block mb-2">Things to Confirm</span>
                  <div v-for="item in mockData.agent_guidance.things_to_confirm" :key="item" class="flex items-center gap-2 mb-1">
                    <i-mdi-checkbox-blank-circle-outline class="w-3 h-3 text-gray-400" />
                    <span class="text-[10px] font-bold" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ item }}</span>
                  </div>
                </div>
              </div>
              
              <div class="pt-4 border-t border-dashed" :class="isDarkMode ? 'border-neutral-800' : 'border-gray-100'">
                <span class="text-[9px] font-bold text-red-500 uppercase block mb-2 uppercase tracking-widest">Crucial: Do Not Do</span>
                <div class="grid grid-cols-2 gap-4">
                   <div v-for="dont in mockData.agent_guidance.do_not_do" :key="dont" class="flex items-center gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                      <i-mdi-close-octagon class="w-3 h-3 text-red-500" />
                      <span class="text-[9px] font-bold text-red-500/80">{{ dont }}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Workflow Suggestions -->
          <div class="grid grid-cols-2 gap-3">
             <div class="p-3 rounded-xl border" :class="isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-gray-50 border-gray-100'">
                <span class="text-[9px] font-bold text-gray-500 uppercase block mb-2">Recommended Categories</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="cat in mockData.workflow_suggestions.recommended_category" :key="cat" class="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold tracking-tight">
                    {{ cat }}
                  </span>
                </div>
             </div>
             <div class="p-3 rounded-xl border" :class="isDarkMode ? 'bg-black/20 border-neutral-800' : 'bg-gray-50 border-gray-100'">
                <span class="text-[9px] font-bold text-gray-500 uppercase block mb-2">Referral Suggestions</span>
                <div v-for="ref in mockData.workflow_suggestions.referral_suggestions" :key="ref" class="text-[10px] font-bold truncate mb-1" :class="isDarkMode ? 'text-gray-300' : 'text-gray-800'">
                   • {{ ref }}
                </div>
             </div>
          </div>
          
          <!-- 6. Supervisor Notes -->
          <div class="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
             <div class="flex items-center gap-2 mb-3">
                <i-mdi-account-tie-voice class="w-4 h-4 text-red-500" />
                <h4 class="text-[11px] font-bold uppercase tracking-widest text-red-500">Supervisor Notification</h4>
             </div>
             <div class="grid grid-cols-2 gap-4">
                <div>
                   <span class="text-[8px] font-bold text-red-500 uppercase block mb-2 opacity-60">Review Triggers</span>
                   <div v-for="reason in mockData.supervisor_notes.reason_for_review" :key="reason" class="text-[10px] font-bold text-red-500/90 mb-1 leading-none uppercase tracking-tighter">
                      {{ reason }}
                   </div>
                </div>
                <div>
                   <span class="text-[8px] font-bold text-gray-500 uppercase block mb-2">AI Processing Constraints</span>
                   <div v-for="limit in mockData.supervisor_notes.ai_limitations" :key="limit" class="text-[9px] font-medium leading-relaxed italic text-gray-500">
                      "{{ limit }}"
                   </div>
                </div>
             </div>
          </div>

        </div>

        <!-- AI Feedback View (Simplified/Updated to maintain audit fields) -->
        <div v-if="activeMode === 'feedback'" class="space-y-6 animate-in fade-in transition-all duration-300">
          <!-- Rating Section -->
          <div class="p-6 rounded-2xl border border-dashed text-center">
            <h4 class="text-base font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Review AI Accuracy</h4>
            
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
                  class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300"
                  :class="(hoverRating || rating) >= star 
                    ? (isDarkMode ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-amber-700 border-amber-700 text-white shadow-lg shadow-amber-900/30') 
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
                class="w-full rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all border"
                :class="isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-white border-gray-100 text-gray-900 shadow-sm'"
              ></textarea>
              
              <div v-if="!feedbackSubmitted" class="flex justify-center">
                <button 
                  @click="submitFeedback"
                  :disabled="isSubmittingFeedback || (rating < 4 && !feedbackComment.trim())"
                  class="px-6 py-2 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  :class="isDarkMode ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' : 'bg-amber-700 hover:bg-amber-800 shadow-amber-900/40'"
                >
                  <span v-if="isSubmittingFeedback" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {{ rating >= 4 ? 'Confirm Accuracy' : 'Submit Feedback' }}
                </button>
              </div>

              <div v-else class="text-amber-500 text-sm font-bold animate-in zoom-in-95 flex items-center justify-center gap-2">
                <i-mdi-check-circle class="w-4 h-4" />
                Feedback Recorded
              </div>
            </div>
          </div>

          <!-- Audit Trail (Comprehensive Analysis Display) -->
          <div class="pt-6 border-t border-dashed space-y-4" :class="isDarkMode ? 'border-neutral-800' : 'border-gray-100'">
            <div class="flex items-center justify-between">
              <h5 class="text-[10px] font-black uppercase tracking-[0.2em]" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Processing Metadata</h5>
              <span class="text-[10px] font-bold border px-2 py-0.5 rounded uppercase" :class="isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-emerald-200 text-emerald-600'">{{ auditData.status }}</span>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <!-- Basic System Info -->
              <div class="grid grid-cols-2 gap-4 p-4 rounded-xl border border-dashed" :class="isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-gray-50 border-gray-200'">
                <div>
                  <span class="text-[10px] font-bold uppercase block mb-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Case & Site ID</span>
                  <p class="text-xs font-mono font-bold" :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'">{{ auditData.case_id }}</p>
                  <p class="text-[10px] font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-400'">{{ auditData.site_id }}</p>
                </div>
                <div class="text-right">
                  <span class="text-[10px] font-bold uppercase block mb-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Created At</span>
                  <p class="text-[10px] font-bold" :class="isDarkMode ? 'text-gray-100' : 'text-gray-900'">{{ new Date(auditData.created_at).toLocaleString() }}</p>
                </div>
              </div>

              <!-- Translation & Transcript Hint -->
              <div class="grid grid-cols-1 gap-4 p-4 rounded-xl border" :class="isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-100 shadow-sm'">
                 <div class="flex items-center justify-between mb-2">
                   <span class="text-[10px] font-bold uppercase" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Input Language Sequence</span>
                   <div class="flex gap-2">
                      <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase">{{ auditData.caller_interaction.primary_language }}</span>
                      <i-mdi-arrow-right class="w-4 h-4 text-gray-500" />
                      <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">{{ auditData.caller_interaction.translated_language }}</span>
                   </div>
                 </div>
                 <div class="p-3 bg-neutral-900/40 rounded-lg border border-transparent italic text-xs leading-relaxed line-clamp-2" :class="isDarkMode ? 'text-gray-200' : 'text-gray-600'">
                    "{{ auditData.caller_interaction.translation.text }}"
                 </div>
              </div>

              <!-- Entities & Participants -->
              <div class="grid grid-cols-2 gap-4">
                 <div class="p-3 rounded-xl border" :class="isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'border-gray-100'">
                    <span class="text-[10px] font-bold uppercase block mb-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Engaged Parties</span>
                    <div class="flex flex-wrap gap-1.5">
                       <span v-for="c in auditData.participants.counsellor" :key="c" class="px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-bold">CNS: {{ c }}</span>
                       <span v-for="v in auditData.participants.victim" :key="v" class="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">VIC: {{ v }}</span>
                    </div>
                 </div>
                 <div class="p-3 rounded-xl border" :class="isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'border-gray-100'">
                    <span class="text-[10px] font-bold uppercase block mb-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Geographic Context</span>
                    <div class="flex flex-wrap gap-1.5">
                       <span v-for="loc in auditData.location.mentioned_locations" :key="loc" class="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">{{ loc }}</span>
                    </div>
                 </div>
              </div>

              <!-- Quality Metrics -->
              <div class="p-4 rounded-xl border transition-all" :class="isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-100/50 border-gray-100'">
                <div class="flex items-center justify-between mb-3">
                   <span class="text-[10px] font-black uppercase tracking-widest" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Quality Assessment Flow</span>
                   <span class="text-[11px] font-black uppercase" :class="auditData.quality_assurance.overall_quality === 'needs_improvement' ? 'text-amber-500' : 'text-emerald-500'">
                     {{ auditData.quality_assurance.overall_quality.replace('_', ' ') }}
                   </span>
                </div>
                <div class="grid grid-cols-6 gap-2 text-center">
                   <div v-for="(val, stage) in auditData.qa_scoring" :key="stage" class="flex flex-col items-center gap-1">
                      <div class="w-2 h-2 rounded-full" :class="val === 'pass' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]' : 'bg-red-500'"></div>
                      <span class="text-[8px] font-bold uppercase tracking-tighter" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">{{ stage }}</span>
                   </div>
                </div>
              </div>

              <!-- Engine trace -->
              <div class="pt-4 border-t border-dashed" :class="isDarkMode ? 'border-neutral-800' : 'border-gray-100'">
                <div class="grid grid-cols-2 gap-4">
                   <div>
                      <span class="text-[10px] font-bold uppercase block mb-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Neural Pipeline</span>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="model in auditData.ai_processing.models_used" :key="model" class="text-[10px] font-bold" :class="isDarkMode ? 'text-gray-300' : 'text-gray-400'">{{ model }} <span class="mx-0.5">•</span> </span>
                      </div>
                   </div>
                   <div class="text-right">
                      <span class="text-[10px] font-bold uppercase block mb-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Execution Metrics</span>
                      <p class="text-[10px] font-bold" :class="isDarkMode ? 'text-gray-100' : 'text-gray-600'">T: {{ auditData.ai_processing.processing_time_seconds }}s</p>
                      <p class="text-[8px] font-mono" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">{{ auditData.audit.mime_type }}</p>
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

// Data from User Request - Domestic Violence Case study
const mockData = {
  "ai_metadata": {
    "input_type": "summary",
    "confidence_level": "high",
    "model": "mistral:7b-instruct",
    "generated_at": "2022-01-01T00:00:00Z"
  },
  "situation_overview": {
    "one_line_summary": "Caller reports ongoing physical abuse by partner, involving two children and fear of retaliation",
    "key_concerns": [
      "physical abuse",
      "domestic violence",
      "children's safety"
    ],
    "population_at_risk": [
      "caller",
      "two children"
    ]
  },
  "risk_signals": {
    "priority_level": "high",
    "risk_flags": [
      "imminent danger",
      "child endangerment"
    ],
    "urgency_indicator": "immediate"
  },
  "suggested_actions": {
    "immediate": [
      "Contact local law enforcement for immediate assistance",
      "Provide resources for emergency shelter and support services"
    ],
    "short_term": [
      "Follow up with the caller to ensure safety",
      "Refer to a social worker or counselor for ongoing support"
    ],
    "follow_up": [
      "Regularly check in with the caller and children"
    ]
  },
  "agent_guidance": {
    "suggested_questions": [
      "Can you provide more details about the last incident?",
      "Do you have a safety plan in place?"
    ],
    "things_to_confirm": [
      "Location of the caller",
      "Safety of the children"
    ],
    "do_not_do": [
      "Disclose personal information about the caller",
      "Minimize call duration"
    ]
  },
  "workflow_suggestions": {
    "recommended_category": [
      "Domestic Violence",
      "Child Protection"
    ],
    "escalation_recommended": true,
    "referral_suggestions": [
      "Local domestic violence agency",
      "Child Protective Services"
    ],
    "prank_or_blank_call_risk": "low"
  },
  "supervisor_notes": {
    "requires_review": true,
    "reason_for_review": [
      "High risk case",
      "Immediate action required"
    ],
    "ai_limitations": [
      "AIs may not fully understand the emotional context of a situation"
    ]
  }
}

const auditData = {
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
      "text": "Hello. Hello. Yes, how are you? Good evening..."
    },
    "translation": {
      "language": "en",
      "text": "Hello, hello, yes, how are you speaking to Amira from Child Healthline...",
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
    "narrative": "Ivan Sumo is speaking to Amira from Child Healthline about a case of child abuse involving a child in Ngarongwe, in Nganongwe.",
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

<style scoped>
.custom-audio-player::-webkit-media-controls-enclosure {
  background-color: transparent;
}
</style>

