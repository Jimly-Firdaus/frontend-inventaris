<script setup lang="ts">
import { useStore } from "src/stores";

const store = useStore();
const router = useRouter();
const formData = ref({
  username: "",
  password: "",
});

const isPwd = ref(true);

const onLogin = async () => {
  store.auth.login(formData.value);
  await router.push({ name: "OwnerDashboardPage" });
};
</script>
<template>
  <q-page class="row items-center justify-center bg-grey-4">
    <q-card
      class="tw-w-full tw-max-w-[300px] md:tw-max-w-[500px] tw-rounded-3xl tw-p-4"
    >
      <q-card-section>
        <p
          class="text-card-title text-center"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          Login
        </p>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onLogin">
          <q-input
            outlined
            v-model="formData.username"
            label="Username"
            class="tw-mb-2"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Field tidak boleh kosong!',
            ]"
          />

          <q-input
            v-model="formData.password"
            outlined
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Field tidak boleh kosong!',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-btn
            :size="$q.screen.lt.sm ? 'md' : 'lg'"
            no-caps
            type="submit"
            label="Login"
            class="tw-w-full"
            color="primary"
            icon="login"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<style scoped lang="scss"></style>
