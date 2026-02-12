// Loads site info from siteinfo.json and populates the homepage and all subpages
fetch('siteinfo.json')
  .then(response => response.json())
  .then(data => {
    // Headline and tagline (homepage)
    if(document.getElementById('headline'))
      document.getElementById('headline').textContent = data.headline || '';
    if(document.getElementById('tagline'))
      document.getElementById('tagline').textContent = data.tagline || '';
    // Hero image (homepage)
    if(document.getElementById('hero-img') && data.gallery && data.gallery.length > 0)
      document.getElementById('hero-img').src = data.gallery[0];
    // Programs (homepage/services)
    const programsList = document.getElementById('programs-list');
    if (programsList && Array.isArray(data.programs)) {
      programsList.innerHTML = '';
      data.programs.forEach(p => {
        const div = document.createElement('div');
        div.className = 'mb-3 p-3 border rounded bg-white shadow-sm';
        // Only show age if it exists
        let ageStr = p.age ? ` <span class='text-muted'>(${p.age})</span>` : '';
        div.innerHTML = `<strong>${p.name}</strong>${ageStr}<br><span>${p.desc || ''}</span>`;
        programsList.appendChild(div);
      });
      // Show fees/subsidy note below programs if present
      if (data.fees) {
        const feesDiv = document.createElement('div');
        feesDiv.className = 'alert alert-info mt-4';
        feesDiv.textContent = data.fees;
        programsList.appendChild(feesDiv);
      }
    }
    // Staff (homepage)
    const staffList = document.getElementById('staff-list');
    if (staffList && Array.isArray(data.staff)) {
      staffList.innerHTML = '';
      data.staff.forEach(s => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        col.innerHTML = `<div class='card h-100 shadow-sm'><div class='card-body'><h5 class='card-title'>${s.name}</h5><h6 class='card-subtitle mb-2 text-muted'>${s.role}</h6><p class='card-text'>${s.bio}</p></div></div>`;
        staffList.appendChild(col);
      });
    }
    // Gallery (gallery.html)
    const galleryList = document.getElementById('gallery-list');
    if (galleryList) {
      // Try to load from assets/gallery folder
      fetch('assets/gallery/gallery.txt')
        .then(resp => resp.text())
        .then(txt => {
          const urls = txt.split('\n').map(x => x.trim()).filter(Boolean);
          galleryList.innerHTML = '';
          urls.forEach(url => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';
            col.innerHTML = `<img src='${url}' class='img-fluid rounded shadow-sm mb-2' alt='Gallery image'>`;
            galleryList.appendChild(col);
          });
        })
        .catch(() => {
          // fallback to siteinfo.json gallery
          if (Array.isArray(data.gallery)) {
            galleryList.innerHTML = '';
            data.gallery.forEach(url => {
              const col = document.createElement('div');
              col.className = 'col-md-6 col-lg-4 mb-4';
              col.innerHTML = `<img src='${url}' class='img-fluid rounded shadow-sm mb-2' alt='Gallery image'>`;
              galleryList.appendChild(col);
            });
          }
        });
    }
    // Contact info (contact.html)
    if(document.getElementById('address')) {
      // Split addresses by semicolon or line break, show as bulleted list
      const addresses = (data.address || '').split(/;|\n/).map(a => a.trim()).filter(Boolean);
      document.getElementById('address').innerHTML = '<strong>Addresses:</strong><ul class="mb-2">' + addresses.map(a => `<li>${a}</li>`).join('') + '</ul>';
      // Show maps for each address if map containers exist
      addresses.forEach((addr, idx) => {
        const mapElem = document.getElementById('map' + (idx+1));
        if (mapElem) {
          const addressParam = encodeURIComponent(addr);
          mapElem.src = `https://maps.google.com/maps?q=${addressParam}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
        }
      });
    }
    if(document.getElementById('phone'))
      document.getElementById('phone').textContent = data.phone || '';
    if(document.getElementById('email'))
      document.getElementById('email').textContent = data.email || '';
    // Show hours as a table if it's an object
    if(document.getElementById('hours')) {
      const hoursElem = document.getElementById('hours');
      if (typeof data.hours === 'object' && data.hours !== null) {
        let html = '<table class="table table-sm mb-0">';
        for (const day of Object.keys(data.hours)) {
          html += `<tr><td class='fw-bold'>${day}</td><td>${data.hours[day]}</td></tr>`;
        }
        html += '</table>';
        hoursElem.innerHTML = html;
      } else {
        hoursElem.textContent = data.hours || '';
      }
    }
  })
  .catch(() => {});
