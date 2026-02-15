const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// Attach click event to all photos with the class .medium-photo
document.querySelectorAll('.medium-photo').forEach(image => {
    image.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = image.src;
    });
});

// Close the lightbox when the overlay is clicked
lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
});