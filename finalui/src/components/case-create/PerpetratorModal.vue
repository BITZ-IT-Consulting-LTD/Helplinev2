<template>
  <div v-if="perpetratorModalOpen" class="fixed top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
    <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-w-[90%] max-h-[90%] overflow-y-auto w-[95%] max-w-[95vw]">
      <!-- Header -->
      <div class="flex justify-between items-center p-5 border-b border-gray-700 bg-gray-900/60">
        <h3 class="m-0 text-lg font-bold text-gray-100">New Perpetrator</h3>
        <button 
          class="text-2xl cursor-pointer text-gray-400 p-1.5 rounded transition-all duration-200 hover:bg-gray-700 hover:text-gray-100"
          @click="closeModal"
        >
          <i-mdi-close class="w-6 h-6" />
        </button>
      </div>

      <div class="p-5 bg-gray-900/40">
        <!-- Show existing perpetrators -->
        <div v-if="perpetrators.length > 0" class="mb-5 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h4 class="m-0 mb-3 text-base font-semibold text-gray-100">Added Perpetrators:</h4>
          <div
            v-for="(perpetrator, index) in perpetrators"
            :key="index"
            class="flex justify-between items-center p-3 bg-gray-700/50 border border-gray-600 rounded-md mb-2 last:mb-0"
          >
            <span class="text-sm text-gray-100 font-medium">
              {{ perpetrator.name || 'Unnamed' }} 
              <span class="text-gray-400">({{ perpetrator.age || 'Unknown age' }}, {{ perpetrator.sex || 'Unknown gender' }})</span>
            </span>
            <button 
              @click="removePerpetrator(index)" 
              class="bg-red-600 text-white border-none px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Multi-step Perpetrator Form -->
        <div class="add-perpetrator-form">
          <h4 class="m-0 mb-4 text-base font-semibold text-gray-100">Add New Perpetrator:</h4>

          <!-- Progress Steps -->
          <div class="mb-6 py-5 border-t border-b border-gray-700">
            <div class="flex justify-between items-center mb-0">
              <div
                v-for="(step, index) in perpetratorSteps"
                :key="index"
                :class="[
                  'flex flex-col items-center gap-2 flex-1 relative',
                  {
                    'completed': currentPerpetratorStep > index,
                    'active': currentPerpetratorStep === index,
                    'future': currentPerpetratorStep < index,
                  },
                ]"
              >
                <span :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm relative z-[2]',
                  currentPerpetratorStep > index ? 'bg-green-600 text-white' : '',
                  currentPerpetratorStep === index ? 'bg-blue-600 text-white ring-4 ring-blue-900/50' : '',
                  currentPerpetratorStep < index ? 'bg-gray-700 text-gray-500 border-2 border-gray-600' : ''
                ]">
                  <span v-if="currentPerpetratorStep > index">✓</span>
                  <span v-else>{{ index + 1 }}</span>
                </span>
                <span :class="[
                  'text-xs font-medium text-center mt-1',
                  currentPerpetratorStep > index ? 'text-green-400 font-semibold' : '',
                  currentPerpetratorStep === index ? 'text-blue-400 font-semibold' : '',
                  currentPerpetratorStep < index ? 'text-gray-500' : ''
                ]">{{ step.title }}</span>
                
                <!-- Connector line -->
                <span 
                  v-if="index < perpetratorSteps.length - 1"
                  :class="[
                    'absolute top-4 left-1/2 right-[-50%] h-0.5 z-[1]',
                    currentPerpetratorStep > index ? 'bg-green-600' : 'bg-gray-700'
                  ]"
                ></span>
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="min-h-[400px]">
            <!-- Step 1: Basic Information -->
            <div v-if="currentPerpetratorStep === 0" class="py-5 animate-fadeIn">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <!-- Name -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Perpetrator's Name *</label>
                  <input
                    v-model="localPerpetratorForm.name"
                    type="text"
                    placeholder="Enter Perpetrator's Names"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Age</label>
                  <input 
                    v-model="localPerpetratorForm.age" 
                    type="number" 
                    placeholder="Enter age"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm" 
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">DOB</label>
                  <input 
                    v-model="localPerpetratorForm.dob" 
                    type="date"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @change="handleDobChange" 
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="perpetrator-age-group"
                    label="Age Group"
                    v-model="localPerpetratorForm.ageGroup"
                    placeholder="Select Age Group"
                    :category-id="101"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="perpetrator-location"
                    label="Location"
                    v-model="localPerpetratorForm.location"
                    placeholder="Select Location"
                    :category-id="88"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="perpetrator-sex"
                    label="Sex"
                    v-model="localPerpetratorForm.sex"
                    placeholder="Select Gender"
                    :category-id="120"
                    @change="updatePerpetratorForm"
                  />
                </div>
              </div>
            </div>

            <!-- Step 2: Identity & Contact -->
            <div v-if="currentPerpetratorStep === 1" class="py-5 animate-fadeIn">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Nearest Landmark</label>
                  <input
                    v-model="localPerpetratorForm.landmark"
                    type="text"
                    placeholder="Enter Nearest Landmark"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="perpetrator-nationality"
                    label="Nationality"
                    v-model="localPerpetratorForm.nationality"
                    placeholder="Select Nationality"
                    :category-id="126"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="perpetrator-id-type"
                    label="ID Type"
                    v-model="localPerpetratorForm.idType"
                    placeholder="Select ID Type"
                    :category-id="362409"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">ID Number</label>
                  <input
                    v-model="localPerpetratorForm.idNumber"
                    type="text"
                    placeholder="Enter ID Number"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="perpetrator-language"
                    label="Language"
                    v-model="localPerpetratorForm.language"
                    placeholder="Select Language"
                    :category-id="123"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Is the Perpetrator a Refugee?</label>
                  <div class="flex gap-4 flex-wrap">
                    <label class="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        v-model="localPerpetratorForm.isRefugee" 
                        value="yes"
                        class="text-blue-600 focus:ring-blue-500"
                        @change="updatePerpetratorForm" 
                      />
                      <span class="text-sm text-gray-300">Yes</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        v-model="localPerpetratorForm.isRefugee" 
                        value="no"
                        class="text-blue-600 focus:ring-blue-500"
                        @change="updatePerpetratorForm" 
                      />
                      <span class="text-sm text-gray-300">No</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        v-model="localPerpetratorForm.isRefugee"
                        value="unknown"
                        class="text-blue-600 focus:ring-blue-500"
                        @change="updatePerpetratorForm"
                      />
                      <span class="text-sm text-gray-300">Unknown</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Contact & Background -->
            <div v-if="currentPerpetratorStep === 2" class="py-5 animate-fadeIn">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="perpetrator-tribe"
                    label="Tribe"
                    v-model="localPerpetratorForm.tribe"
                    placeholder="Select Tribe"
                    :category-id="133"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Phone Number</label>
                  <input
                    v-model="localPerpetratorForm.phone"
                    type="tel"
                    placeholder="Enter Phone Number"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Alternative Phone</label>
                  <input
                    v-model="localPerpetratorForm.alternativePhone"
                    type="tel"
                    placeholder="Enter Alternate Phone Number"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Email</label>
                  <input
                    v-model="localPerpetratorForm.email"
                    type="email"
                    placeholder="Enter Email Address"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="Relationship with Client"
                    label="Relationship with Client?"
                    v-model="localPerpetratorForm.relationship"
                    placeholder="Select relationship"
                    :category-id="236634"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="Shares Home with Client"
                    label="Shares Home with Client?"
                    v-model="localPerpetratorForm.sharesHome"
                    placeholder="Select option"
                    :category-id="236631"
                    @change="updatePerpetratorForm"
                  />
                </div>
              </div>
            </div>

            <!-- Step 4: Status & Details -->
            <div v-if="currentPerpetratorStep === 3" class="py-5 animate-fadeIn">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="Health Status"
                    label="Health Status"
                    v-model="localPerpetratorForm.healthStatus"
                    placeholder="Select health status"
                    :category-id="236660"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="Perpetrator's Profession"
                    label="Perpetrator's Profession"
                    v-model="localPerpetratorForm.profession"
                    placeholder="Select profession"
                    :category-id="236648"
                    @change="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <BaseSelect
                    id="Perpetrator's Marital Status"
                    label="Perpetrator's Marital Status"
                    v-model="localPerpetratorForm.maritalStatus"
                    placeholder="Select marital status"
                    :category-id="236654"
                    @change="handleMaritalStatusChange"
                  />

                  <!-- Conditional Fields: Spouse Details -->
                  <div v-if="showSpouseFields" class="mt-4 p-4 bg-gray-800 border border-gray-600 rounded-lg">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-100 mb-1">Spouse Name</label>
                        <input
                          v-model="localPerpetratorForm.spouseName"
                          type="text"
                          placeholder="Enter spouse's name"
                          class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                          @input="updatePerpetratorForm"
                        />
                      </div>
                      
                      <div class="flex flex-col gap-2">
                        <BaseSelect
                          id="spouse-profession"
                          label="Spouse Profession"
                          v-model="localPerpetratorForm.spouseProfession"
                          placeholder="Select spouse's profession"
                          :category-id="236648"
                          @change="updatePerpetratorForm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Perpetrator's Guardian's Name</label>
                  <input
                    v-model="localPerpetratorForm.guardianName"
                    type="text"
                    placeholder="Enter Perpetrator's Guardian Name"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm"
                  />
                </div>

                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="text-sm font-semibold text-gray-100 mb-1">Additional Details</label>
                  <textarea
                    v-model="localPerpetratorForm.additionalDetails"
                    placeholder="Enter Additional Details"
                    rows="4"
                    class="px-4 py-3 border border-gray-600 rounded-lg text-sm bg-gray-700 text-gray-100 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    @input="updatePerpetratorForm"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Step Navigation -->
          <div class="flex justify-between items-center mt-6 pt-5 border-t border-gray-700">
            <button
              v-if="currentPerpetratorStep > 0"
              @click="prevStep"
              type="button"
              class="px-5 py-2.5 border-none rounded-lg font-medium cursor-pointer transition-all duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center gap-2"
            >
              <i-mdi-chevron-left class="w-5 h-5" />
              Previous
            </button>
            <div v-else></div>
            
            <button
              v-if="currentPerpetratorStep < perpetratorSteps.length - 1"
              @click="nextStep"
              type="button"
              class="px-5 py-2.5 border-none rounded-lg font-medium cursor-pointer transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              Next
              <i-mdi-chevron-right class="w-5 h-5" />
            </button>
            <button
              v-if="currentPerpetratorStep === perpetratorSteps.length - 1"
              @click="handleAddPerpetrator"
              type="button"
              class="px-5 py-2.5 border-none rounded-lg font-medium cursor-pointer transition-all duration-200 bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
            >
              <i-mdi-check class="w-5 h-5" />
              Add Perpetrator
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";
import BaseSelect from "@/components/base/BaseSelect.vue";

// Props from parent
const props = defineProps({
  perpetratorModalOpen: { type: Boolean, required: true },
  perpetrators: { type: Array, required: true },
  perpetratorForm: { type: Object, required: true },
  currentPerpetratorStep: { type: Number, required: true }
});

// Events back to parent
const emit = defineEmits([
  "close-modal",
  "add-perpetrator",
  "remove-perpetrator",
  "next-perpetrator-step",
  "prev-perpetrator-step",
  "update-perpetrator-form"
]);

// Create local reactive copy of the form
const localPerpetratorForm = reactive({
  ...props.perpetratorForm,
  name: props.perpetratorForm.name || '',
  age: props.perpetratorForm.age || '',
  dob: props.perpetratorForm.dob || '',
  ageGroup: props.perpetratorForm.ageGroup || '',
  location: props.perpetratorForm.location || '',
  sex: props.perpetratorForm.sex || '',
  landmark: props.perpetratorForm.landmark || '',
  nationality: props.perpetratorForm.nationality || '',
  idType: props.perpetratorForm.idType || '',
  idNumber: props.perpetratorForm.idNumber || '',
  language: props.perpetratorForm.language || '',
  isRefugee: props.perpetratorForm.isRefugee || '',
  tribe: props.perpetratorForm.tribe || '',
  phone: props.perpetratorForm.phone || '',
  alternativePhone: props.perpetratorForm.alternativePhone || '',
  email: props.perpetratorForm.email || '',
  relationship: props.perpetratorForm.relationship || '',
  sharesHome: props.perpetratorForm.sharesHome || '',
  healthStatus: props.perpetratorForm.healthStatus || '',
  profession: props.perpetratorForm.profession || '',
  maritalStatus: props.perpetratorForm.maritalStatus || '',
  guardianName: props.perpetratorForm.guardianName || '',
  additionalDetails: props.perpetratorForm.additionalDetails || '',
  spouseName: props.perpetratorForm.spouseName || '',
  spouseProfession: props.perpetratorForm.spouseProfession || ''
});

// Watch for changes from parent
watch(() => props.perpetratorForm, (newForm) => {
  Object.assign(localPerpetratorForm, newForm);
}, { deep: true });

// Steps list
const perpetratorSteps = [
  { title: "Basic Information" },
  { title: "Identity & Contact" },
  { title: "Contact & Background" },
  { title: "Status & Details" },
];

const singleStatusValues = [
  'single', 'Single', 'SINGLE',
  'unknown', 'Unknown', 'UNKNOWN',
  'unmarried', 'Unmarried',
  'never married', 'Never Married',
];

const showSpouseFields = computed(() => {
  const maritalStatus = localPerpetratorForm.maritalStatus;
  if (!maritalStatus) return false;
  
  const statusValue = String(maritalStatus);
  const isSingleOrUnknown = singleStatusValues.some(singleStatus => {
    return statusValue.toLowerCase() === String(singleStatus).toLowerCase();
  });
  
  return !isSingleOrUnknown;
});

const updatePerpetratorForm = () => {
  emit('update-perpetrator-form', { ...localPerpetratorForm });
};

const handleMaritalStatusChange = () => {
  if (!showSpouseFields.value) {
    localPerpetratorForm.spouseName = '';
    localPerpetratorForm.spouseProfession = '';
  }
  updatePerpetratorForm();
};

const handleDobChange = (event) => {
  const dob = event.target ? event.target.value : event;
  
  if (dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age >= 0) {
      localPerpetratorForm.age = age.toString();
      
      if (age < 6) localPerpetratorForm.ageGroup = '0-5';
      else if (age <= 12) localPerpetratorForm.ageGroup = '6-12';
      else if (age <= 17) localPerpetratorForm.ageGroup = '13-17';
      else if (age <= 25) localPerpetratorForm.ageGroup = '18-25';
      else if (age <= 35) localPerpetratorForm.ageGroup = '26-35';
      else if (age <= 50) localPerpetratorForm.ageGroup = '36-50';
      else localPerpetratorForm.ageGroup = '51+';
    }
  }
  
  updatePerpetratorForm();
};

const handleAddPerpetrator = () => {
  if (!localPerpetratorForm.name?.trim()) {
    alert('Perpetrator name is required');
    return;
  }
  
  console.log('Adding perpetrator with data:', localPerpetratorForm);
  emit("add-perpetrator");
};

const closeModal = () => emit("close-modal");
const removePerpetrator = (index) => emit("remove-perpetrator", index);
const nextStep = () => {
  updatePerpetratorForm();
  emit("next-perpetrator-step");
};
const prevStep = () => {
  updatePerpetratorForm();
  emit("prev-perpetrator-step");
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>