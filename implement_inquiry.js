const fs = require('fs');

// 1. Update klimatske-naprave.html
let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

// A. Inject the button into each card
// We can find the `Uradna stran` link and append our button.
// But we need the model name. The model name is inside `<h3 ...>MODEL NAME — ...</h3>`
// Let's use a regex that matches the whole card from <h3> to the Uradna stran link.

const cardRegex = /<h3 class="text-xl font-bold text-brand-black mb-3 leading-tight">(.*?)<\/h3>[\s\S]*?<a href="([^"]+)" target="_blank" rel="noopener noreferrer" class="([^"]+)">\s*Uradna stran\s*<svg[^>]+>.*?<\/svg>\s*<\/a>\s*<\/div>/g;

html = html.replace(cardRegex, (match, titleHtml, linkUrl, linkClasses) => {
  const modelName = titleHtml.split(/—|-/)[0].trim().replace(/"/g, '&quot;');
  
  // Create the new button block.
  // We'll replace the single `<a>` tag with a wrapper that contains both `<a>` and `<button>`
  
  const buttonsHtml = `
                <div class="flex flex-col sm:flex-row items-center justify-end gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                  <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="${linkClasses}">
                    Uradna stran
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </a>
                  <button type="button" onclick="selectModelAndScroll('${modelName}')" class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue-dark shadow-md hover:shadow-lg rounded-lg transition-all w-full sm:w-auto text-center">
                    Pošlji povpraševanje
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>
                </div>
              </div>`; // close the parent div of the footer
              
  return match.replace(/<a href="[^"]+" target="_blank" rel="noopener noreferrer" class="[^"]+">\s*Uradna stran\s*<svg[^>]+>.*?<\/svg>\s*<\/a>\s*<\/div>/, buttonsHtml);
});

// B. Inject the selected model UI into the form
const formFieldsStart = '<div id="form-fields" class="space-y-5">';
const modelFieldHtml = `
            <!-- ZAKLENJEN MODEL KLIME (Skrito privzeto, prikaže se ob kliku zgoraj) -->
            <div id="selected-model-container" class="hidden relative overflow-hidden bg-brand-blue-soft border border-brand-blue/30 rounded-xl p-4 shadow-inner">
              <div class="absolute top-0 right-0 p-2 opacity-20">
                <svg class="w-16 h-16 text-brand-blue-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div class="relative z-10">
                <label for="selected_model" class="block text-xs font-bold uppercase tracking-wider text-brand-blue-deep mb-1">Izbrana naprava za povpraševanje</label>
                <div class="flex items-center gap-2">
                  <input type="text" id="selected_model" name="selected_model" readonly
                    class="w-full bg-transparent border-none text-brand-black text-lg md:text-xl font-extrabold p-0 focus:ring-0 cursor-default"
                    value="" />
                  <button type="button" onclick="clearSelectedModel()" class="text-gray-400 hover:text-red-500 transition" aria-label="Odstrani model" title="Odstrani izbiro">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            </div>`;

if (!html.includes('id="selected-model-container"')) {
  html = html.replace(formFieldsStart, formFieldsStart + '\n' + modelFieldHtml);
}

// C. Inject the JS function before </body>
const scriptHtml = `
<script>
  function selectModelAndScroll(modelName) {
    const container = document.getElementById('selected-model-container');
    const input = document.getElementById('selected_model');
    const formSection = document.getElementById('kontakt');
    
    // Set the value and show the container
    input.value = modelName;
    container.classList.remove('hidden');
    
    // Set category to 'Klimatske naprave'
    const categorySelect = document.getElementById('category-select');
    if(categorySelect) categorySelect.value = 'Klimatske naprave';
    
    // Smooth scroll down
    if(formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function clearSelectedModel() {
    const container = document.getElementById('selected-model-container');
    const input = document.getElementById('selected_model');
    input.value = '';
    container.classList.add('hidden');
  }
</script>
`;

if (!html.includes('function selectModelAndScroll(')) {
  html = html.replace('</body>', scriptHtml + '\n</body>');
}

// D. Add selected_model to the fetch request in klimatske-naprave.html
if (!html.includes("selectedModel: formData.get('selected_model')")) {
  html = html.replace(
    "website: formData.get('website'),",
    "website: formData.get('website'),\n        selectedModel: formData.get('selected_model'),"
  );
}

fs.writeFileSync('klimatske-naprave.html', html);


// 2. Update api/send-email.js
let apiCode = fs.readFileSync('api/send-email.js', 'utf8');

if (!apiCode.includes('selectedModel')) {
  apiCode = apiCode.replace(
    "const { name, email, phone, category, message, website, pageUrl } = req.body;",
    "const { name, email, phone, category, message, website, pageUrl, selectedModel } = req.body;"
  );
  
  // Add to plain text
  apiCode = apiCode.replace(
    "Kategorija: ${category || '/'}\\n",
    "Kategorija: ${category || '/'}\\nIzbrani model: ${selectedModel || '/'}\\n"
  );
  
  // Add to HTML table
  apiCode = apiCode.replace(
    "<tr><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\"><strong>Kategorija:</strong></td><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\">${escapeHtml(category || '/')}</td></tr>",
    "<tr><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\"><strong>Kategorija:</strong></td><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\">${escapeHtml(category || '/')}</td></tr>\n            <tr><td style=\"padding: 8px 0; border-bottom: 1px solid #eee;\"><strong>Izbrani model:</strong></td><td style=\"padding: 8px 0; border-bottom: 1px solid #eee; color: #3B82B5; font-weight: bold;\">${escapeHtml(selectedModel || '/')}</td></tr>"
  );
  
  // Add to Client Email HTML
  // We'll insert a line if selectedModel exists
  const clientModelHtml = `
            \${selectedModel ? \`
            <div style="background-color: #fff; border: 1px solid #A5D1E8; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 0; color: #333; font-size: 14px;">Vaše povpraševanje vključuje naslednjo napravo:</p>
              <p style="margin: 5px 0 0 0; color: #3B82B5; font-weight: bold; font-size: 16px;">\${escapeHtml(selectedModel)}</p>
            </div>
            \` : ''}`;
            
  apiCode = apiCode.replace(
    "za vas pripravimo najboljšo rešitev.</p>\n            </div>",
    "za vas pripravimo najboljšo rešitev.</p>\n            </div>" + clientModelHtml
  );
  
  fs.writeFileSync('api/send-email.js', apiCode);
}

console.log('Implement Inquiry complete!');
