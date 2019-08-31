let net;
const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();
async function app() {
  //console.log('Loading mobilenet..');
  // Load the model.
  net = await mobilenet.load();
  await setupWebcam();
  while (true) {
    const result = await net.classify(webcamElement);

    document.getElementById('console').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;

    await tf.nextFrame();
  }
}
async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

async function predict(){
  document.getElementById('p1').innerText ="Sucessfully loaded model";
  const imgEl = document.getElementById('output');
  const result = await net.classify(imgEl);
  document.getElementById('p2').innerText ="result:";
  document.getElementById('final-prediction').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;
}
document.getElementById("btn-predict").onclick = function() {predict()};

app();