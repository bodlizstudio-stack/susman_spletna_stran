const fs = require('fs');

let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

// The current footer block looks like this (with some variations in the classes because of previous scripts):
/*
              <div class="mt-auto border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span class="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">MODEL_NAME</span>
                <div class="flex flex-col sm:flex-row items-center justify-end gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                  <a href="..." target="_blank" rel="noopener noreferrer" class="...">
                    Uradna stran
                    <svg ...></svg>
                  </a>
                  <button type="button" onclick="selectModelAndScroll('...')" class="...">
                    Pošlji povpraševanje
                    <svg ...></svg>
                  </button>
                </div>
              </div>
*/

// Regex to capture:
// 1: The model name badge text
// 2: The Uradna stran href
// 3: The selectModelAndScroll argument

const footerRegex = /<div class="mt-auto border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">\s*<span class="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">(.*?)<\/span>\s*<div class="flex flex-col sm:flex-row items-center justify-end gap-2 w-full sm:w-auto mt-3 sm:mt-0">\s*<a href="([^"]+)" target="_blank" rel="noopener noreferrer"[^>]*>[\s\S]*?<svg[^>]*>[\s\S]*?<\/svg>\s*<\/a>\s*<button type="button" onclick="selectModelAndScroll\('([^']+)'\)"[^>]*>[\s\S]*?<svg[^>]*>[\s\S]*?<\/svg>\s*<\/button>\s*<\/div>\s*<\/div>/g;

html = html.replace(footerRegex, (match, badgeText, linkUrl, modelName) => {
  return `<div class="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-3">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg line-clamp-2" title="${badgeText}">${badgeText}</span>
                  <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-blue-deep bg-brand-blue-soft hover:bg-brand-blue/30 rounded-lg transition-colors">
                    Uradna stran
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </a>
                </div>
                <button type="button" onclick="selectModelAndScroll('${modelName}')" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue-dark shadow-sm hover:shadow-md rounded-xl transition-all">
                  Pošlji povpraševanje
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>`;
});

fs.writeFileSync('klimatske-naprave.html', html);
console.log('Optimized card footers successfully!');
