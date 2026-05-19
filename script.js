// Loading Screen
function hideLoadingScreen() {
    const ls = document.getElementById('loading-screen');
    ls.style.opacity = '0';
    setTimeout(() => ls.style.display = 'none', 800);
}

// ==================== WEBGL BACKGROUND ====================
function initWebGL() {
    const canvas = document.getElementById('webgl-bg');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 30;

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 8000;
    const posArray = new Float32Array(starsCount * 3);
    const colorArray = new Float32Array(starsCount * 3);

    for(let i = 0; i < starsCount * 3; i += 3) {
        const radius = 80;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        posArray[i]     = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = radius * Math.cos(phi);

        const brightness = Math.random();
        colorArray[i]     = brightness > 0.6 ? 0.9 : 0.7;
        colorArray[i + 1] = brightness > 0.7 ? 0.8 : 0.9;
        colorArray[i + 2] = 1.0;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 0.13,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthTest: false
    });

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Nebula
    const nebula = new THREE.Mesh(
        new THREE.SphereGeometry(65, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x7c3aed,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        })
    );
    scene.add(nebula);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        starField.rotation.y += 0.0001;
        nebula.rotation.y += 0.00005;
        
        starField.rotation.x = mouseY * 0.07;
        starField.rotation.y += mouseX * 0.05;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ==================== 3D CARDS ====================
function initCards() {
    const cards = document.querySelectorAll(".profile-card");

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width/2) / 18;
            const y = (e.clientY - rect.top - rect.height/2) / 18;
            card.style.setProperty('--rx', `${-y}deg`);
            card.style.setProperty('--ry', `${x}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });

        card.addEventListener("click", (e) => {
            if (e.target.closest('a')) return;
            cards.forEach(c => { if (c !== card) c.classList.remove("active"); });
            card.classList.toggle("active");
        });
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.profile-card')) {
            cards.forEach(c => c.classList.remove('active'));
        }
    });
}

// Initialize Everything
window.addEventListener('load', () => {
    initWebGL();
    initCards();
    hideLoadingScreen();
});
