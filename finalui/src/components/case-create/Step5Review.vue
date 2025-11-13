<template>
  <div class="min-h-96">
    <div class="flex flex-col gap-3">
      <!-- Reporter Information -->
      <div class="border border-gray-700 rounded-lg bg-gray-800">
        <div class="flex items-center justify-between p-3 px-4 border-b border-gray-700">
          <div class="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <i-mdi-account class="w-5 h-5 text-blue-400" />
            Reporter Information
          </div>
          <button class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm hover:bg-gray-600 transition-colors" @click="goToStep(2)">
            <i-mdi-pencil class="w-4 h-4" />
            Edit
          </button>
        </div>
        <div class="p-3 px-4 grid grid-cols-2 gap-3">
          <div>
            <div class="font-semibold text-gray-400 text-sm">Name</div>
            <div class="text-gray-100">{{ formData.step2.name || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Phone</div>
            <div class="text-gray-100">{{ formData.step2.phone || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Location</div>
            <div class="text-gray-100">{{ formData.step2.location || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Is Client</div>
            <div>
              <span class="inline-block px-2 py-0.5 rounded text-xs font-medium" :class="formData.step2.isClient ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'">
                {{ formData.step2.isClient ? "Yes" : "No" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Case Details -->
      <div class="border border-gray-700 rounded-lg bg-gray-800">
        <div class="flex items-center justify-between p-3 px-4 border-b border-gray-700">
          <div class="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <i-mdi-folder class="w-5 h-5 text-blue-400" />
            Case Details
          </div>
          <button class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm hover:bg-gray-600 transition-colors" @click="goToStep(3)">
            <i-mdi-pencil class="w-4 h-4" />
            Edit
          </button>
        </div>
        <div class="p-3 px-4 grid grid-cols-2 gap-3">
          <div class="col-span-2">
            <div class="font-semibold text-gray-400 text-sm">Case Narrative</div>
            <div class="text-gray-100">{{ formData.step3.narrative || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">GBV Related</div>
            <div>
              <span class="inline-block px-2 py-0.5 rounded text-xs font-medium" :class="formData.step3.isGBVRelated ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'">
                {{ formData.step3.isGBVRelated ? "Yes" : "No" }}
              </span>
            </div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Incident Date</div>
            <div class="text-gray-100">{{ formData.step3.incidentDate || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Location</div>
            <div class="text-gray-100">{{ formData.step3.location || "N/A" }}</div>
          </div>
        </div>
      </div>

      <!-- Classification -->
      <div class="border border-gray-700 rounded-lg bg-gray-800">
        <div class="flex items-center justify-between p-3 px-4 border-b border-gray-700">
          <div class="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <i-mdi-tag class="w-5 h-5 text-blue-400" />
            Classification
          </div>
          <button class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm hover:bg-gray-600 transition-colors" @click="goToStep(4)">
            <i-mdi-pencil class="w-4 h-4" />
            Edit
          </button>
        </div>
        <div class="p-3 px-4 grid grid-cols-2 gap-3">
          <div>
            <div class="font-semibold text-gray-400 text-sm">Department</div>
            <div class="text-gray-100">{{ formatDepartment(formData.step4.department) || "N/A" }}</div>
          </div>
          <div class="col-span-2">
            <div class="font-semibold text-gray-400 text-sm">Categories</div>
            <div>
              <div v-if="formData.step4.categories.length > 0" class="flex flex-wrap gap-1.5 min-h-8 p-1">
                <span v-for="category in formData.step4.categories" :key="category" class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium border border-blue-600/30">
                  {{ category }}
                </span>
              </div>
              <span v-else class="text-gray-100">N/A</span>
            </div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Priority</div>
            <div>
              <span v-if="formData.step4.priority" class="inline-block px-2 py-0.5 rounded text-xs font-medium" :class="getPriorityClass(formData.step4.priority)">
                {{ formatPriority(formData.step4.priority) }}
              </span>
              <span v-else class="text-gray-100">N/A</span>
            </div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Status</div>
            <div>
              <span v-if="formData.step4.status" class="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
                {{ formatStatus(formData.step4.status) }}
              </span>
              <span v-else class="text-gray-100">N/A</span>
            </div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Justice System State</div>
            <div class="text-gray-100">{{ formData.step4.justiceSystemState || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">General Assessment</div>
            <div class="text-gray-100">{{ formData.step4.generalAssessment || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Services Offered</div>
            <div class="text-gray-100">{{ formData.step4.servicesOffered || "N/A" }}</div>
          </div>
          <div>
            <div class="font-semibold text-gray-400 text-sm">Referral Source</div>
            <div class="text-gray-100">{{ formData.step4.referralSource || "N/A" }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-3 justify-end mt-6 pt-5 border-t border-gray-700">
      <button type="button" class="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors" @click="goToStep(4)">Back</button>
      <button type="button" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2" @click="submitCase">
        <i-mdi-check class="w-5 h-5" />
        Create Case
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: { type: Number, required: true },
  formData: { type: Object, required: true }
});

const emit = defineEmits(["go-to-step", "submit-case"]);

function goToStep(step) {
  emit("go-to-step", step);
}

function submitCase() {
  emit("submit-case", props.formData);
}

function formatDepartment(value) {
  if (!value) return "";
  const map = {
    "116": "116",
    "labor": "Labor",
    health: "Health",
    police: "Police",
    legal: "Legal",
    welfare: "Welfare"
  };
  return map[value] || value;
}

function formatPriority(value) {
  if (!value) return "";
  const map = {
    high: "High",
    medium: "Medium",
    low: "Low"
  };
  return map[value] || value;
}

function formatStatus(value) {
  if (!value) return "";
  const map = {
    open: "Open",
    in_progress: "In Progress",
    closed: "Closed"
  };
  return map[value] || value;
}

function getPriorityClass(value) {
  if (!value) return "";
  const map = {
    high: "bg-red-600/20 text-red-400 border border-red-600/30",
    medium: "bg-amber-600/20 text-amber-400 border border-amber-600/30",
    low: "bg-green-600/20 text-green-400 border border-green-600/30"
  };
  return map[value] || "bg-gray-600/20 text-gray-400 border border-gray-600/30";
}
</script>