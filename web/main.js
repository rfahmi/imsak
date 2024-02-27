document.addEventListener('DOMContentLoaded', function () {
  // Terms and conditions content
  const termsContent = `
        <p>By using the Imsak, you agree to the following terms and conditions:</p>
        <ol>
            <li>The Imsak provides prayer schedule information and weather forecasts based on the user's precise location in Indonesia.</li>
            <li>The app utilizes the user's location services to provide accurate prayer schedules and weather forecasts.</li>
            <li>The prayer schedule data provided by the app is sourced from reputable sources and is intended for informational purposes only. Users are encouraged to verify the accuracy of the provided schedules with local authorities.</li>
            <li>The weather forecasts provided by the app are based on reliable meteorological data. However, users should exercise caution and not solely rely on the app's forecasts for making important decisions.</li>
            <li>The Imsak is designed for use in Indonesia only. It may not provide accurate information or function properly outside of Indonesia.</li>
            <li>Users are solely responsible for their use of the Imsak and any consequences that may arise from reliance on its features.</li>
            <li>The developers of the Imsak are not liable for any damages or losses resulting from the use of the app.</li>
        </ol>
        <p>By continuing to use the Imsak, you agree to abide by these terms and conditions. If you do not agree with any part of these terms, you must discontinue use of the app.</p>
    `;

  // Display terms and conditions content
  const termsDiv = document.getElementById('terms');
  termsDiv.innerHTML = termsContent;
});
