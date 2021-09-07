<script lang="ts">
  import { sendEmailVerification } from '@ts/FirebaseImports';
  import { user } from '@ts/stores';

  user.subscribe(async (u) => {
    if (u && !u.emailVerified) {
      await sendEmailVerification($user);
      window.history.back();
    }
  });
</script>
