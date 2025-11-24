<template>
  <div class="min-h-screen bg-gray-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6">
        <h1 class="text-2xl font-bold text-gray-100 mb-6">
          Reporter Form Demo
        </h1>

        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="border-b border-gray-700 pb-6">
            <h2 class="text-lg font-semibold text-gray-100 mb-4">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  v-model="formData.fname"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  v-model="formData.dob"
                  type="date"
                  @change="handleDobChange"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                />
                <p v-if="formData.dob" class="text-xs text-gray-400 mt-1">
                  Auto-fills Age and Age Group
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  v-model="formData.age"
                  type="number"
                  :readonly="!!formData.dob"
                  :class="[
                    'w-full px-3 py-2 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500',
                    formData.dob ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700'
                  ]"
                  placeholder="Age (auto-calculated from DOB)"
                />
              </div>

              <div>
                <BaseSelect
                  id="reporter-age-group"
                  label="Age Group"
                  v-model="formData.ageGroup"
                  placeholder="Select Age Group (auto-filled from DOB)"
                  :category-id="101"
                  :readonly="!!formData.dob"
                  :disabled="!!formData.dob"
                />
                <p v-if="formData.dob" class="text-xs text-gray-400 mt-1">
                  Auto-selected based on DOB
                </p>
              </div>

              <div>
                <BaseSelect
                  id="reporter-sex"
                  label="Sex"
                  v-model="formData.sex"
                  placeholder="Select sex"
                  :category-id="120"
                />
              </div>

              <div>
                <BaseSelect
                  id="reporter-location"
                  label="Location"
                  v-model="formData.location"
                  placeholder="Select location"
                  :category-id="88"
                />
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="border-b border-gray-700 pb-6">
            <h2 class="text-lg font-semibold text-gray-100 mb-4">Contact Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Alternative Phone
                </label>
                <input
                  v-model="formData.phone2"
                  type="tel"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="Alternative phone"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Nearest Landmark
                </label>
                <input
                  v-model="formData.landmark"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="Enter landmark"
                />
              </div>
            </div>
          </div>

          <!-- Additional Details -->
          <div class="border-b border-gray-700 pb-6">
            <h2 class="text-lg font-semibold text-gray-100 mb-4">Additional Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <BaseSelect
                  id="reporter-nationality"
                  label="Nationality"
                  v-model="formData.nationality"
                  placeholder="Select nationality"
                  :category-id="126"
                />
              </div>

              <div>
                <BaseSelect
                  id="reporter-language"
                  label="Language"
                  v-model="formData.language"
                  placeholder="Select language"
                  :category-id="123"
                />
              </div>

              <div>
                <BaseSelect
                  id="reporter-tribe"
                  label="Tribe"
                  v-model="formData.tribe"
                  placeholder="Select tribe"
                  :category-id="133"
                />
              </div>

              <div>
                <BaseSelect
                  id="reporter-id-type"
                  label="ID Type"
                  v-model="formData.idType"
                  placeholder="Select ID type"
                  :category-id="362409"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  ID Number
                </label>
                <input
                  v-model="formData.idNumber"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="Enter ID number"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Is Refugee?
                </label>
                <div class="flex gap-4 mt-2">
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input
                      v-model="formData.isRefugee"
                      type="radio"
                      value="1"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="text-sm text-gray-300">Yes</span>
                  </label>
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input
                      v-model="formData.isRefugee"
                      type="radio"
                      value="0"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="text-sm text-gray-300">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 justify-end">
            <button
              @click="handleReset"
              :disabled="reporterStore.loading"
              class="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              @click="handleSubmit"
              :disabled="reporterStore.loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="reporterStore.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ reporterStore.loading ? 'Creating...' : 'Create Reporter' }}
            </button>
          </div>
        </div>

        <!-- Response Display -->
        <div v-if="response" class="mt-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
          <h3 class="text-lg font-semibold text-green-400 mb-2">
            Success! Reporter ID: {{ response.id || 'Created' }}
          </h3>
          <div class="mb-3">
            <button
              @click="showPayload = !showPayload"
              class="text-sm text-green-400 hover:text-green-300 underline"
            >
              {{ showPayload ? 'Hide' : 'Show' }} Payload
            </button>
          </div>
          <pre v-if="showPayload" class="text-xs text-gray-300 overflow-x-auto max-h-64 p-2 bg-gray-900 rounded">{{ JSON.stringify(response, null, 2) }}</pre>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="mt-6 p-4 bg-red-900/20 border border-red-600 rounded-lg">
          <h3 class="text-lg font-semibold text-red-400 mb-2">Error</h3>
          <p class="text-sm text-gray-300">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useReporterStore } from '@/stores/reporters';
import BaseSelect from '@/components/base/BaseSelect.vue';

export default {
  name: 'ReporterFormDemo',
  components: {
    BaseSelect
  },
  setup() {
    const reporterStore = useReporterStore();

    const formData = reactive({
      fname: '',
      age: '',
      dob: '',
      ageGroup: '',
      sex: '',
      location: '',
      landmark: '',
      nationality: '',
      language: '',
      tribe: '',
      phone: '',
      phone2: '',
      email: '',
      idType: '',
      idNumber: '',
      isRefugee: '0'
    });

    const response = ref(null);
    const error = ref(null);
    const showPayload = ref(false);

    // Calculate age from date of birth
    const calculateAge = (dob) => {
      if (!dob) return null;
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 0 ? Math.floor(age) : null; // Round to whole number
    };

    // Determine age group based on age
    const getAgeGroupFromAge = (age) => {
      if (age === null || age < 0) return '';
      if (age < 6) return '0-5';
      if (age <= 12) return '6-12';
      if (age <= 17) return '13-17';
      if (age <= 24) return '18-24';
      if (age <= 35) return '25-35';
      if (age <= 50) return '36-50';
      return '51+';
    };

    // Map age group text to category ID from backend
    const getAgeGroupId = (ageGroupText) => {
      const map = {
        '0-5': '361950',
        '6-12': '361951',
        '13-17': '361952',
        '18-24': '361953',
        '25-35': '361954',
        '36-50': '361955',
        '51+': '361956'
      };
      return map[ageGroupText] || '';
    };

    const getSexId = (sex) => {
      const map = {
        'Male': '121',
        'Female': '122',
        'Other': '123'
      };
      return map[sex] || '';
    };

    // Handle DOB change - auto-calculate age and age group
    const handleDobChange = () => {
      if (formData.dob) {
        const calculatedAge = calculateAge(formData.dob);
        
        if (calculatedAge !== null) {
          formData.age = calculatedAge.toString();
          const ageGroupText = getAgeGroupFromAge(calculatedAge);
          const ageGroupId = getAgeGroupId(ageGroupText);
          
          // Set the age group ID which BaseSelect uses
          formData.ageGroup = ageGroupId;
          
          console.log('DOB changed:', {
            dob: formData.dob,
            age: formData.age,
            ageGroupText: ageGroupText,
            ageGroupId: ageGroupId
          });
        }
      } else {
        // Clear age and age group if DOB is removed
        formData.age = '';
        formData.ageGroup = '';
      }
    };

    const handleSubmit = async () => {
      // Validate only name is required
      if (!formData.fname || !formData.fname.trim()) {
        error.value = 'Reporter name is required';
        return;
      }

      error.value = null;
      response.value = null;
      showPayload.value = false;

      try {
        // Generate unique identifiers
        const timestamp = Date.now();
        const timestampSeconds = (timestamp / 1000).toFixed(3);
        const userId = "100";
        const srcUid = `walkin-${userId}-${timestamp}`;
        const srcUid2 = `${srcUid}-1`;
        const srcCallId = srcUid2;

        // Convert DOB to Unix timestamp
        const dobTimestamp = formData.dob ? Math.floor(new Date(formData.dob).getTime() / 1000) : '';

        // Helper function to only include non-empty values
        const getValueOrDefault = (value, defaultValue = "") => {
          return value !== null && value !== undefined && value !== "" ? value : defaultValue;
        };

        // Build payload
        const payload = {
          ".id": "",
          src: "walkin",
          src_ts: timestampSeconds,
          src_uid: srcUid,
          src_uid2: srcUid2,
          src_callid: srcCallId,
          src_usr: userId,
          src_vector: "2",
          src_address: getValueOrDefault(formData.phone),
          
          fname: formData.fname,
          age_t: "0",
          age: getValueOrDefault(formData.age),
          dob: dobTimestamp.toString(),
          age_group: getAgeGroupFromAge(parseInt(formData.age)),
          age_group_id: getValueOrDefault(formData.ageGroup),
          
          sex: formData.sex ? `^${formData.sex}` : "",
          sex_id: getSexId(formData.sex),
          
          location_id: getValueOrDefault(formData.location),
          landmark: getValueOrDefault(formData.landmark),
          nationality_id: getValueOrDefault(formData.nationality),
          lang_id: getValueOrDefault(formData.language),
          tribe_id: getValueOrDefault(formData.tribe),
          
          phone: getValueOrDefault(formData.phone),
          phone2: getValueOrDefault(formData.phone2),
          email: getValueOrDefault(formData.email),
          
          national_id_type_id: getValueOrDefault(formData.idType),
          national_id: getValueOrDefault(formData.idNumber),
          
          is_refugee: getValueOrDefault(formData.isRefugee, "0"),
          
          contact_uuid_id: "-1",
          disposition_id: "363034",
          activity_id: "",
          activity_ca_id: ""
        };

        console.log('Submitting payload:', JSON.stringify(payload, null, 2));

        // Use the reporter store to create reporter
        const result = await reporterStore.createReporter(payload);
        
        if (result) {
          response.value = result;
          console.log('Reporter created successfully:', result);
          alert('Reporter created successfully!');
        } else {
          throw new Error('No response from server');
        }

      } catch (err) {
        console.error('Error creating reporter:', err);
        error.value = err.message || 'Failed to create reporter';
      }
    };

    const handleReset = () => {
      Object.assign(formData, {
        fname: '',
        age: '',
        dob: '',
        ageGroup: '',
        sex: '',
        location: '',
        landmark: '',
        nationality: '',
        language: '',
        tribe: '',
        phone: '',
        phone2: '',
        email: '',
        idType: '',
        idNumber: '',
        isRefugee: '0'
      });
      response.value = null;
      error.value = null;
      showPayload.value = false;
    };

    return {
      reporterStore,
      formData,
      response,
      error,
      showPayload,
      handleDobChange,
      handleSubmit,
      handleReset,
      JSON
    };
  }
};
</script>