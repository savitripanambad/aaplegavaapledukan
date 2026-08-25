import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Shop, Worker } from '../types';
import {
  APP_OWNER_INFO,
  ADMIN_NAME,
  ADMIN_NAME_MR,
  AGENCY_NAME_MR,
  ADMIN_PHONE,
  ADMIN_UPI_ID,
  REGISTRATION_DISCOUNTED_PRICE
} from './helpers';

/**
 * High-quality Marathi Devanagari HTML element to PDF export.
 * Converts the rendered HTML DOM with exact font, joḍakshare, and colors to PDF.
 */
export async function exportElementToMarathiPdf(
  element: HTMLElement,
  fileName: string = 'marathi-document.pdf'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/png');
  const isLandscape = canvas.width > canvas.height;
  const pdf = new jsPDF(isLandscape ? 'l' : 'p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Add the crisp canvas image to PDF
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  pdf.save(fileName);
}

/**
 * Generate a beautifully styled, high-res Marathi Registration Certificate PDF for a shop
 */
export async function downloadMarathiShopCertificate(shop: Shop): Promise<void> {
  // Create an off-screen container with Devanagari typography
  const container = document.createElement('div');
  container.id = 'marathi-pdf-temp-container';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.padding = '36px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = "'Noto Sans Devanagari', 'Mukta', 'Segoe UI', Tahoma, sans-serif";
  container.style.color = '#0f172a';
  container.style.boxSizing = 'border-box';

  const currentDate = new Date().toLocaleDateString('mr-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  container.innerHTML = `
    <div style="border: 4px double #ea580c; padding: 28px; border-radius: 16px; background: #fffaf5; position: relative;">
      <div style="text-align: center; border-bottom: 2px solid #fed7aa; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="display: inline-block; background: #ea580c; color: white; font-size: 13px; font-weight: bold; padding: 4px 16px; border-radius: 999px; margin-bottom: 8px;">
          महाराष्ट्र ग्रामीण डिजिटल व्यापारी निर्देशिका
        </div>
        <h1 style="font-size: 28px; font-weight: 900; color: #9a3412; margin: 4px 0;">आपलं गाव, आपलं दुकान</h1>
        <p style="font-size: 13px; color: #7c2d12; margin: 0;">अधिकृत डिजिटल नोंदणी प्रमाणपत्र व पावती</p>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 14px; color: #64748b;">हे प्रमाणित करण्यात येते की,</span>
        <h2 style="font-size: 26px; font-weight: 800; color: #1e293b; margin: 8px 0;">${shop.marathiName || shop.name}</h2>
        <p style="font-size: 16px; font-weight: bold; color: #ea580c; margin: 0;">दुकानदार / मालक: ${shop.ownerName}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: bold; color: #475569; width: 35%;">दुकान नोंदणी क्रमांक (ID):</td>
            <td style="padding: 10px 14px; font-weight: bold; color: #0f172a; font-family: monospace;">${shop.id}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">वर्ग / कॅटेगरी:</td>
            <td style="padding: 10px 14px; font-weight: bold; color: #0f172a;">${shop.categoryLabelMr || shop.category}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">मोबाईल नंबर:</td>
            <td style="padding: 10px 14px; font-weight: bold; color: #0f172a;">+91 ${shop.mobile}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">गाव / शहर व जिल्हा:</td>
            <td style="padding: 10px 14px; font-weight: bold; color: #0f172a;">${shop.villageOrCity}, जि. ${shop.district}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">संपूर्ण पत्ता:</td>
            <td style="padding: 10px 14px; color: #334155;">${shop.fullAddress}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">नोंदणी स्थिती:</td>
            <td style="padding: 10px 14px; font-weight: bold; color: ${shop.approvalStatus === 'approved' ? '#15803d' : '#d97706'};">
              ${shop.approvalStatus === 'approved' ? '✓ अधिकृत मंजूर (Approved & Live)' : '⏳ अ‍ॅडमिन मंजुरी प्रलंबित (Pending Verification)'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #475569;">नोंदणी शुल्क भरणा:</td>
            <td style="padding: 10px 14px; font-weight: bold; color: #047857;">₹${REGISTRATION_DISCOUNTED_PRICE}/- (एकवेळ नोंदणी यशस्वी)</td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; padding-top: 16px; border-top: 1px dashed #cbd5e1;">
        <div>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 4px 0;">प्रमाणपत्र जारी दिनांक: <strong>${currentDate}</strong></p>
          <p style="font-size: 12px; color: #64748b; margin: 0;">पोर्टल: <strong>आपलं गाव आपलं दुकान (aaplegavaapledukan)</strong></p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 2px;">${ADMIN_NAME_MR}</div>
          <div style="font-size: 11px; color: #ea580c; font-weight: 600;">संचालक - ${AGENCY_NAME_MR}</div>
          <div style="font-size: 11px; color: #64748b;">मोबाईल: +91 ${ADMIN_PHONE}</div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const cleanFileName = `dukan-pramanpatra-${shop.marathiName.replace(/\s+/g, '_') || shop.id}.pdf`;
    await exportElementToMarathiPdf(container, cleanFileName);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Generate and download a formatted PDF report of Shops
 */
export function exportShopsToPdf(
  shops: Shop[],
  title: string = 'आपलं गावातील दुकान - नोंदणीकृत दुकाने यादी (Registered Shops List)',
  filterLabel: string = 'सर्व दुकाने'
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Header Background banner
  doc.setFillColor(234, 88, 12); // Orange-600
  doc.rect(0, 0, 297, 22, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AAPLA GAVATIL DUKAN - MAHARASHTRA BUSINESS DIRECTORY', 14, 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Agency: ${AGENCY_NAME_MR} | Admin: ${ADMIN_NAME} (${ADMIN_PHONE}) | Address: Jalna-Beed Road, Ambad, Dist Jalna PIN 431204`,
    14,
    17
  );

  // Subheader & Meta
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Report: ${title}`, 14, 30);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Filter: ${filterLabel} | Total Shops: ${shops.length} | Generated on: ${currentDate} at ${currentTime}`,
    14,
    68
  );

  // Prepare table data
  const tableRows = shops.map((shop, index) => {
    const status =
      shop.isDisabled
        ? 'Disabled (Band)'
        : shop.approvalStatus === 'approved'
        ? 'Approved (Live)'
        : shop.approvalStatus === 'pending'
        ? 'Pending Review'
        : 'Rejected';

    const payment = shop.isPaid ? `Paid (Rs.${REGISTRATION_DISCOUNTED_PRICE})` : 'Unpaid';
    const loc = `${shop.villageOrCity || ''}, ${shop.district || ''}`;
    const category = shop.categoryLabelEn || shop.category || '';

    return [
      (index + 1).toString(),
      shop.name || shop.marathiName || 'Shop',
      shop.ownerName || '',
      category,
      shop.mobile || '',
      loc,
      shop.fullAddress || '',
      payment,
      status,
      shop.joinedDate || currentDate,
    ];
  });

  // Table styling with autoTable
  autoTable(doc, {
    startY: 40,
    head: [
      [
        'Sr.',
        'Shop Name',
        'Owner Name',
        'Category',
        'Mobile No.',
        'Village / Dist',
        'Full Address',
        'Payment',
        'Status',
        'Reg. Date',
      ],
    ],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [249, 115, 22], // Orange-500
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // Sr.
      1: { cellWidth: 40, fontStyle: 'bold' }, // Shop
      2: { cellWidth: 32 }, // Owner
      3: { cellWidth: 24 }, // Category
      4: { cellWidth: 26, halign: 'center' }, // Mobile
      5: { cellWidth: 32 }, // Village/Dist
      6: { cellWidth: 46 }, // Address
      7: { cellWidth: 22, halign: 'center' }, // Payment
      8: { cellWidth: 24, halign: 'center' }, // Status
      9: { cellWidth: 18, halign: 'center' }, // Date
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 12, right: 12 },
    didDrawPage: (data) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount} | Aapla Gavatil Dukan - Savitri Multiservices Ambad (Dist Jalna) | Support: +91 ${ADMIN_PHONE}`,
        14,
        205
      );
    },
  });

  const cleanFileName = `aapla-dukan-shops-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(cleanFileName);
}

/**
 * Generate and download a formatted PDF report of Workers
 */
export function exportWorkersToPdf(
  workers: Worker[],
  title: string = 'कुशल कारागीर / कामगार यादी (Skilled Workers & Artisans List)'
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Header Background banner
  doc.setFillColor(79, 70, 229); // Indigo-600
  doc.rect(0, 0, 297, 22, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AAPLA GAVATIL DUKAN - SKILLED ARTISANS & WORKERS DIRECTORY', 14, 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Agency: ${AGENCY_NAME_MR} | Admin: ${ADMIN_NAME} (${ADMIN_PHONE}) | Address: Jalna-Beed Road, Ambad, Dist Jalna PIN 431204`,
    14,
    198
  );

  // Subheader
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Report: ${title}`, 14, 30);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Total Workers: ${workers.length} | Generated on: ${currentDate}`,
    14,
    36
  );

  const tableRows = workers.map((worker, index) => {
    const status = worker.isDisabled
      ? 'Disabled'
      : worker.approvalStatus === 'approved'
      ? 'Approved'
      : 'Pending';

    return [
      (index + 1).toString(),
      worker.name,
      worker.professionLabelEn || worker.profession || '',
      worker.mobile,
      `${worker.villageOrCity}, ${worker.district}`,
      worker.experienceYears ? `${worker.experienceYears} Years` : '1+ Year',
      worker.dailyRate || 'Variable',
      worker.skills ? worker.skills.join(', ') : '',
      status,
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [
      [
        'Sr.',
        'Worker Name',
        'Profession',
        'Mobile No.',
        'Village / District',
        'Experience',
        'Daily Rate',
        'Skills',
        'Status',
      ],
    ],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [99, 102, 241], // Indigo-500
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 38, fontStyle: 'bold' },
      2: { cellWidth: 28 },
      3: { cellWidth: 26, halign: 'center' },
      4: { cellWidth: 36 },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 26, halign: 'center' },
      7: { cellWidth: 60 },
      8: { cellWidth: 22, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 12, right: 12 },
  });

  const cleanFileName = `aapla-dukan-workers-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(cleanFileName);
}

/**
 * Generate and download a formatted PDF report of Payments received
 */
export function exportPaymentsToPdf(
  shops: Shop[],
  title: string = 'आपलं गावातील दुकान - पेमेंट व महसूल अहवाल (Admin Payment Log Report)'
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const paidShops = shops.filter((s) => s.isPaid || s.paymentDetails);
  const totalAmount = paidShops.reduce((sum, s) => sum + (s.paymentDetails?.amount || REGISTRATION_DISCOUNTED_PRICE), 0);

  // Header Background banner
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, 297, 24, 'F');

  // Header Title
  doc.setTextColor(245, 158, 11); // Amber-500
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('AAPLA GAVATIL DUKAN - ADMIN PAYMENT TRACKING & REVENUE REPORT', 14, 9);

  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Beneficiary: ${AGENCY_NAME_MR} (${ADMIN_NAME}) | Official UPI ID: ${ADMIN_UPI_ID} | Phone: +91 ${ADMIN_PHONE}`,
    14,
    16
  );
  doc.text(
    `Office: Savitri Multiservices, Beed-Jalna Road, Ambad, Dist Jalna PIN 431204 | Non-Refundable Fee Policy`,
    14,
    21
  );

  // Subheader & Meta
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Report: ${title}`, 14, 32);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Total Paid Shops: ${paidShops.length} | Total Revenue Collected: Rs. ${totalAmount}.00 | Generated: ${currentDate} ${currentTime}`,
    14,
    38
  );

  const tableRows = paidShops.map((shop, index) => {
    const pay = shop.paymentDetails;
    const amountStr = `Rs. ${pay?.amount || REGISTRATION_DISCOUNTED_PRICE}`;
    const dateStr = pay?.date || shop.joinedDate || currentDate;
    const timeStr = pay?.time || '10:00 AM';
    const utrStr = pay?.utrNumber || `UPI-REC-${shop.id.slice(-6)}`;
    const statusStr = 'Completed (Paid)';

    return [
      (index + 1).toString(),
      shop.name || shop.marathiName || 'Shop',
      shop.ownerName || '',
      shop.mobile || '',
      `${shop.villageOrCity || ''}, ${shop.district || ''}`,
      amountStr,
      `${dateStr} ${timeStr}`,
      utrStr,
      ADMIN_UPI_ID,
      statusStr,
    ];
  });

  autoTable(doc, {
    startY: 42,
    head: [
      [
        'Sr.',
        'Shop Name',
        'Owner Name',
        'Mobile No.',
        'Location',
        'Amount Paid',
        'Date & Time',
        'UTR / Ref No.',
        'Received on UPI',
        'Status',
      ],
    ],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [16, 185, 129], // Emerald-500
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 42, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 26, halign: 'center' },
      4: { cellWidth: 34 },
      5: { cellWidth: 24, halign: 'center', fontStyle: 'bold', textColor: [4, 120, 87] },
      6: { cellWidth: 30, halign: 'center' },
      7: { cellWidth: 34, halign: 'center', fontStyle: 'bold' },
      8: { cellWidth: 30, halign: 'center' },
      9: { cellWidth: 24, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [240, 253, 244], // Emerald-50
    },
    margin: { left: 12, right: 12 },
  });

  const cleanFileName = `aapla-dukan-payments-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(cleanFileName);
}
