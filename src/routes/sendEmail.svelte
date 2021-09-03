<script lang="ts">
  import { sendEmailVerification, getAuth } from '@ts/FirebaseImports';
  import { user } from '@ts/stores';

  const send = async () => {
    const auth = getAuth();
    if (!auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser);
    }
    window.history.back();
  };

  user.subscribe((u) => {
    if (u && u != 'unknown') {
      send();
    }
  });
</script>
