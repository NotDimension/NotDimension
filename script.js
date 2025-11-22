
<script>
  feather.replace();

  // Vouch System with Moderation
  const ADMIN_PASSWORD = 'notdim2024'; // CHANGE THIS PASSWORD!
  let currentSlide = 0;
  let approvedVouches = [];

  // Load approved vouches
  async function loadApprovedVouches() {
    try {
      const result = await window.storage.list('vouch:approved:', true);
      if (result && result.keys) {
        approvedVouches = [];
        for (const key of result.keys) {
          try {
            const data = await window.storage.get(key, true);
            if (data) {
              approvedVouches.push(JSON.parse(data.value));
            }
          } catch (e) {
            console.log('Vouch not found:', key);
          }
        }
        displayCarousel();
      }
    } catch (e) {
      console.log('No vouches yet');
      displayCarousel();
    }
  }

  // Display carousel
  function displayCarousel() {
    const container = document.getElementById('vouch-slides');
    
    if (approvedVouches.length === 0) {
      container.innerHTML = '<p class="text-center text-[#d6bfa7]">No vouches yet. Be the first to submit one!</p>';
      return;
    }

    const vouch = approvedVouches[currentSlide];
    const avatarUrl = vouch.avatarUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(vouch.discordId || '0') % 5}.png`;
    
    container.innerHTML = `
      <div class="flex items-start gap-4">
        <img src="${avatarUrl}" alt="${vouch.username}" 
             class="w-16 h-16 rounded-full border-2 border-[#d6bfa7]"
             onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
        <div class="flex-1">
          <h4 class="font-semibold text-[#f5efe9]">${vouch.username}</h4>
          <p class="text-[#d6bfa7] text-sm mt-2">"${vouch.text}"</p>
          <p class="text-xs text-[#a89684] mt-2">${new Date(vouch.timestamp).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="text-center mt-4 text-sm text-[#d6bfa7]">${currentSlide + 1} / ${approvedVouches.length}</div>
    `;
  }

  // Carousel navigation
  document.getElementById('prevVouch').addEventListener('click', () => {
    if (approvedVouches.length > 0) {
      currentSlide = (currentSlide - 1 + approvedVouches.length) % approvedVouches.length;
      displayCarousel();
    }
  });

  document.getElementById('nextVouch').addEventListener('click', () => {
    if (approvedVouches.length > 0) {
      currentSlide = (currentSlide + 1) % approvedVouches.length;
      displayCarousel();
    }
  });

  // Submit vouch modal
  const vouchModal = document.getElementById('vouchModal');
  const adminModal = document.getElementById('adminModal');

  document.getElementById('openVouchBtn').addEventListener('click', () => {
    vouchModal.classList.remove('hidden');
    vouchModal.classList.add('flex');
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    vouchModal.classList.add('hidden');
    vouchModal.classList.remove('flex');
  });

  document.getElementById('submitVouch').addEventListener('click', async () => {
    const username = document.getElementById('vouchUser').value.trim();
    const discordId = document.getElementById('vouchDiscordId').value.trim();
    const avatarUrl = document.getElementById('vouchAvatarUrl').value.trim();
    const text = document.getElementById('vouchText').value.trim();
    const status = document.getElementById('submitStatus');

    if (!username || !text) {
      status.innerHTML = '<span class="text-red-400">Please fill in username and vouch text!</span>';
      return;
    }

    const vouch = {
      id: Date.now(),
      username,
      discordId,
      avatarUrl,
      text,
      timestamp: Date.now(),
      status: 'pending'
    };

    try {
      // Check if storage is available
      if (!window.storage) {
        status.innerHTML = '<span class="text-yellow-400">Storage not available in this environment.</span>';
        return;
      }

      const result = await window.storage.set(`vouch:pending:${vouch.id}`, JSON.stringify(vouch), true);
      
      status.innerHTML = '<span class="text-green-400">✓ Vouch submitted successfully! Awaiting approval.</span>';
      
      setTimeout(() => {
        vouchModal.classList.add('hidden');
        vouchModal.classList.remove('flex');
        document.getElementById('vouchUser').value = '';
        document.getElementById('vouchDisc
