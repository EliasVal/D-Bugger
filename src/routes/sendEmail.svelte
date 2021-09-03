<script lang="ts">
  import { sendEmailVerification } from '@ts/FirebaseImports';
  import { user } from '@ts/stores';

  const send = async () => {
    if (!$user?.emailVerified) {
      await sendEmailVerification($user);
    }
    window.history.back();
  };

  send();
</script>
