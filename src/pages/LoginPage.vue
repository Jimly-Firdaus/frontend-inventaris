<script setup lang="ts">
import { useStore } from "src/stores";
import { USER_ROLE } from "src/constants/user";

const store = useStore();
const router = useRouter();
const formData = ref({
  username: "",
  password: "",
});

const isPwd = ref(true);

const redirectLoggedInUser = async () => {
  if (store.auth.user) {
    switch (store.auth.user.role) {
      case USER_ROLE.OWNER:
        await router.push({ name: "TransactionsPage" });
        break;
      case USER_ROLE.WAREHOUSE_MANAGER:
        await router.push({ name: "ManageProductsPage" });
        break;
      case USER_ROLE.STORE_MANAGER:
        await router.push({ name: "ManageStoresPage" });
        break;
    }
  }
}

const onLogin = async () => {
  await store.auth.login(formData.value);
  await redirectLoggedInUser();
};

onMounted(async () => {
  await redirectLoggedInUser();
})
</script>
<template>
  <q-page class="row items-center justify-center bg-grey-4">
    <q-card
      class="tw-w-full tw-max-w-[300px] md:tw-max-w-[500px] tw-rounded-3xl tw-p-4"
    >
      <q-card-section>
        <p
          class="text-card-title text-center text-grey-10 tw-font-bold tw-mb-0"
          :class="$q.screen.lt.sm ? '' : ''"
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
            class="tw-mb-2 text-body-medium"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
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
            class="text-body-medium"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
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
            class="tw-w-full tw-mt-4"
            color="primary"
            icon="login"
            rounded
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<style scoped lang="scss"></style>
