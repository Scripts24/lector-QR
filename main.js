//Crea elemento
const video = document.createElement("video");

//Nuestro canvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

//div donde llegará nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

//Lectura desactivada
let scanning = false;

//Función para encender la cámara
const encenderCamara = () => {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            scanning = true;
            btnScanQR.hidden = true;
            canvasElement.hidden = false;
            video.setAttribute("playsinline", true); // Necesario decirle a iOS safari que no queremos pantalla completa
            video.srcObject = stream;
            video.play();
            tick();
            scan();
        });
};

//Funciones para levantar las funciones de encendido de la camara
function tick() {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    scanning && requestAnimationFrame(tick);
}

function scan() {
    try {
        qrcode.decode();
    } catch (e) {
        setTimeout(scan, 300);
    }
}

//Apagará la cámara
const cerrarCamara = () => {
    video.srcObject.getTracks().forEach((track) => {
        track.stop();
    });
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
};

const activarSonido = () => {
    var audio = document.getElementById('audioScaner');
    audio.play();
}

// Callback cuando termina de leer el código QR
qrcode.callback = (res) => {
    if (res) {
        // Aquí, 'res' contiene el texto decodificado del código QR
        // Puedes realizar las acciones deseadas con el texto
        console.log("Texto del código QR:", res);

        // Verificar si el contenido parece ser una URL
        const isURL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(res);

        if (isURL) {
            // Configuración de estilos personalizados para URL
            const customStyles = {
                fontFamily: 'Roboto Condensed, sans-serif',
                fontSize: '14px',
                color: '#ffffff',
                background: 'black',
                showCloseButton: true,
            };

            // Configurar la alerta de SweetAlert solo para URLs
            const swalConfig = {
                text: 'Haz clic en el botón para redirigirte',
                showConfirmButton: true,
                confirmButtonText: 'Ir',
                footer: res,  // Agrega el enlace al pie de la alerta
                color: '#ffffff',
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    content: 'custom-swal-content',
                    confirmButton: 'custom-swal-confirm-button',
                },
                heightAuto: false,
                ...customStyles,
                preConfirm: () => {
                    // Redirige al usuario al hacer clic en el botón "Ir"
                    window.location.href = res;
                }
            };

            // Mostrar la alerta solo para URLs
            Swal.fire(swalConfig).then(() => {
                activarSonido();
                cerrarCamara();
            });
        } else {
            // Si no es una URL, muestra un SweetAlert con el texto
            const textConfig = {
                text: 'Texto del código QR: ' + res,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                customClass: {
                    container: 'custom-swal-container',
                    popup: 'custom-swal-popup',
                    content: 'custom-swal-content',
                    confirmButton: 'custom-swal-confirm-button',
                },
            };

            Swal.fire(textConfig).then(() => {
                activarSonido();
                cerrarCamara();
            });

        }
    }
};



/*evento para mostrar la camara sin el boton 
window.addEventListener('load', (e) => {
    encenderCamara();
})*/