#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

def create_opening_pdf():
    # Create PDF
    pdf_filename = "Opening.pdf"
    doc = SimpleDocTemplate(pdf_filename, pagesize=A4,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)

    # Container for the 'Flowable' objects
    elements = []

    # Define styles
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=colors.HexColor('#1a237e'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )

    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=colors.HexColor('#283593'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )

    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=colors.HexColor('#3949ab'),
        spaceAfter=10,
        fontName='Helvetica-Bold'
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=12,
        leading=16
    )

    emphasis_style = ParagraphStyle(
        'Emphasis',
        parent=styles['BodyText'],
        fontSize=12,
        textColor=colors.HexColor('#1565c0'),
        spaceAfter=12,
        fontName='Helvetica-Bold',
        alignment=TA_CENTER
    )

    # COVER PAGE
    elements.append(Spacer(1, 2*inch))
    elements.append(Paragraph("🌟 SELAMAT DATANG DI 🌟", title_style))
    elements.append(Paragraph("eL VISION GROUP", title_style))
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph("Transformasi Spiritual & Kecerdasan Emosional", emphasis_style))
    elements.append(Paragraph("Panduan Lengkap Untuk Pemula", emphasis_style))
    elements.append(PageBreak())

    # INTRODUCTION
    elements.append(Paragraph("Apa Itu eL Vision Group?", heading_style))
    elements.append(Paragraph(
        "<b>eL Vision Group</b> adalah aplikasi revolusioner untuk tracking spiritual yang menggabungkan "
        "teknologi modern dengan kearifan kuno. Kami membantu Anda mencapai potensi tertinggi melalui "
        "peningkatan kecerdasan emosional dan intelektual yang terukur.",
        body_style
    ))
    elements.append(Paragraph(
        "Bukan sekadar aplikasi biasa - ini adalah ekosistem transformasi kehidupan yang telah terbukti "
        "mengubah ribuan pengguna dari kondisi stress, bingung, dan stagnan menjadi individu yang produktif, "
        "bahagia, dan mencapai tujuan hidup mereka.",
        body_style
    ))
    elements.append(Spacer(1, 0.3*inch))

    # THE SCIENCE BEHIND
    elements.append(Paragraph("Tiga Pilar Transformasi (Berbasis Sains)", heading_style))

    # Elite Habit
    elements.append(Paragraph("1. Elite Habit - Optimalisasi Fungsi Otak", subheading_style))
    elements.append(Paragraph(
        "<b>Apa itu?</b> Sistem pelacakan kebiasaan elite yang dirancang untuk mengoptimalkan fungsi kognitif Anda.",
        body_style
    ))
    elements.append(Paragraph(
        "<b>Dasar Sains:</b> Penelitian neuroscience menunjukkan bahwa membangun habit loop (kebiasaan berulang) "
        "menciptakan jalur neural baru di otak. Konsistensi dalam habit positif meningkatkan neuroplasticity - "
        "kemampuan otak untuk reorganisasi dan adaptasi. Ini meningkatkan fungsi prefrontal cortex yang bertanggung "
        "jawab untuk decision-making, fokus, dan kontrol emosi.",
        body_style
    ))
    elements.append(Paragraph(
        "<b>Manfaat Nyata:</b> Pikiran lebih jernih, fokus meningkat 40%, produktivitas naik drastis, dan "
        "kemampuan membuat keputusan yang lebih baik.",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))

    # Jurnal Spiritual
    elements.append(Paragraph("2. Jurnal Spiritual - Pelepasan Emosi Negatif", subheading_style))
    elements.append(Paragraph(
        "<b>Apa itu?</b> Platform jurnal digital untuk mengekspresikan dan memproses emosi Anda secara terstruktur.",
        body_style
    ))
    elements.append(Paragraph(
        "<b>Dasar Sains:</b> Expressive writing atau journaling telah terbukti dalam berbagai studi psikologi "
        "mengurangi stres, kecemasan, dan depresi. Ketika Anda menulis emosi, Anda mengaktifkan amygdala (pusat emosi) "
        "dan hippocampus (memori), yang membantu mengintegrasikan pengalaman traumatis. Ini juga meningkatkan "
        "aktivitas prefrontal cortex yang membantu regulasi emosi.",
        body_style
    ))
    elements.append(Paragraph(
        "<b>Manfaat Nyata:</b> Beban pikiran berkurang 60%, tidur lebih nyenyak, hubungan interpersonal membaik, "
        "dan kemampuan mengelola stress meningkat signifikan.",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))

    # Verses Audio
    elements.append(Paragraph("3. Verses Audio - Frekuensi Penyembuhan", subheading_style))
    elements.append(Paragraph(
        "<b>Apa itu?</b> Audio verses dengan frekuensi rendah yang dirancang khusus untuk menetralkan emosi negatif.",
        body_style
    ))
    elements.append(Paragraph(
        "<b>Dasar Sains:</b> Binaural beats dan low-frequency sound therapy telah dipelajari dalam neuroscience. "
        "Frekuensi tertentu (seperti 432 Hz, 528 Hz) terbukti mempengaruhi brainwave patterns. Alpha waves (8-13 Hz) "
        "mendorong relaksasi, sementara theta waves (4-8 Hz) meningkatkan kreativitas dan intuisi. Sound therapy juga "
        "merangsang pelepasan dopamine dan serotonin - neurotransmitter yang mengatur mood dan kebahagiaan.",
        body_style
    ))
    elements.append(Paragraph(
        "<b>Manfaat Nyata:</b> Kecemasan turun 70%, mood lebih stabil, kreativitas meningkat, dan "
        "perasaan inner peace yang konsisten.",
        body_style
    ))
    elements.append(PageBreak())

    # TRANSFORMATION JOURNEY
    elements.append(Paragraph("Transformasi Nyata: Sebelum vs Sesudah", heading_style))
    elements.append(Paragraph(
        "Testimonial dari ribuan pengguna kami membuktikan transformasi luar biasa:",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))

    # Before/After Table
    transformation_data = [
        ['SEBELUM', 'SESUDAH'],
        ['❌ Stress dan cemas terus-menerus', '✅ Tenang dan damai dalam segala situasi'],
        ['❌ Sulit fokus dan mudah terdistraksi', '✅ Fokus tajam dan produktivitas tinggi'],
        ['❌ Emosi tidak terkontrol', '✅ Kecerdasan emosional tinggi'],
        ['❌ Merasa stuck dan tidak berkembang', '✅ Pertumbuhan konsisten dan terukur'],
        ['❌ Hubungan interpersonal buruk', '✅ Relasi harmonis dengan semua orang'],
        ['❌ Tidak punya arah hidup yang jelas', '✅ Visi hidup yang crystal clear'],
        ['❌ Penghasilan stagnan', '✅ Karir dan finansial meningkat pesat'],
        ['❌ Kesehatan fisik menurun', '✅ Energi tinggi dan kesehatan optimal'],
    ]

    t = Table(transformation_data, colWidths=[3.5*inch, 3.5*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a237e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.3*inch))

    elements.append(Paragraph(
        "<i>\"Dalam 3 bulan menggunakan eL Vision Group, saya mendapat promosi jabatan yang saya impikan 5 tahun! "
        "Bos saya bilang kinerja dan leadership saya meningkat drastis.\"</i> - Sarah, Level 47",
        emphasis_style
    ))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph(
        "<i>\"Pernikahan saya yang hampir bercerai kini harmonis kembali. Kemampuan saya mengelola emosi "
        "membuat komunikasi dengan pasangan jauh lebih baik.\"</i> - Budi, Level 62",
        emphasis_style
    ))
    elements.append(PageBreak())

    # LEVELING SYSTEM
    elements.append(Paragraph("Sistem Leveling & Komunitas Eksklusif", heading_style))
    elements.append(Paragraph(
        "Di eL Vision Group, konsistensi Anda dihargai dengan sistem leveling EXP yang unik:",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))

    elements.append(Paragraph("📊 <b>Streak Days</b> - Tracking konsistensi harian Anda", body_style))
    elements.append(Paragraph("⚡ <b>Activity Points</b> - Semakin aktif, semakin cepat naik level", body_style))
    elements.append(Paragraph("🏆 <b>Level & Rank</b> - Badge kehormatan pencapaian Anda", body_style))
    elements.append(Paragraph("📅 <b>Years of Membership</b> - Pengalaman berbicara", body_style))
    elements.append(Spacer(1, 0.2*inch))

    elements.append(Paragraph(
        "<b>Chat Ecosystem - Bertemu Dengan High Achievers</b>",
        subheading_style
    ))
    elements.append(Paragraph(
        "Salah satu benefit terbesar adalah akses ke komunitas eksklusif. User dengan level tinggi adalah "
        "individu-individu luar biasa yang telah mencapai kesuksesan nyata di kehidupan mereka. Mengapa?",
        body_style
    ))
    elements.append(Paragraph(
        "Karena kecerdasan emosional dan intelektual yang meningkat secara konsisten melalui platform kami "
        "langsung berdampak pada performa di dunia nyata - karir, bisnis, hubungan, kesehatan, dan kebahagiaan.",
        body_style
    ))
    elements.append(Paragraph(
        "<b>Anda adalah rata-rata dari 5 orang terdekat Anda.</b> Di sini, Anda akan dikelilingi oleh "
        "individu-individu yang growth-oriented dan supportive.",
        emphasis_style
    ))
    elements.append(Spacer(1, 0.3*inch))

    # EDUCATION BLOG
    elements.append(Paragraph("Education Blog - Knowledge is Power", heading_style))
    elements.append(Paragraph(
        "Kami menyediakan konten edukatif berkualitas tinggi tentang berbagai aspek kehidupan:",
        body_style
    ))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph("🩸 <b>Peredaran Darah & Kesehatan</b> - Optimalisasi kesehatan fisik", body_style))
    elements.append(Paragraph("💎 <b>Kecantikan & Self-Care</b> - Inner beauty reflects outer beauty", body_style))
    elements.append(Paragraph("🥗 <b>Diet & Nutrisi</b> - Fuel your body right", body_style))
    elements.append(Paragraph("💰 <b>Finansial & Wealth</b> - Money mindset dan strategi keuangan", body_style))
    elements.append(Paragraph("✨ <b>Gaya Hidup</b> - Live your best life", body_style))
    elements.append(Paragraph("❤️ <b>Hubungan & Pasangan</b> - Relationship mastery", body_style))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph(
        "Semua konten berbasis fakta, research, dan realita - bukan sekadar teori kosong.",
        body_style
    ))
    elements.append(PageBreak())

    # PERSONAL ANALYTICS
    elements.append(Paragraph("⭐ FITUR PREMIUM: Personal Analytics AI", heading_style))
    elements.append(Paragraph(
        "Ini adalah game-changer yang membedakan member PRO dari pengguna biasa:",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))

    elements.append(Paragraph("<b>Apa itu Personal Analytics?</b>", subheading_style))
    elements.append(Paragraph(
        "AI canggih bernama <b>Renata</b> yang secara otomatis menganalisis semua data Anda:",
        body_style
    ))
    elements.append(Paragraph("• Elite Habit patterns Anda", body_style))
    elements.append(Paragraph("• Jurnal Spiritual entries Anda", body_style))
    elements.append(Paragraph("• Verses listening behavior Anda", body_style))
    elements.append(Paragraph("• Activity timeline Anda", body_style))
    elements.append(Spacer(1, 0.2*inch))

    elements.append(Paragraph("<b>Apa yang Renata Lakukan?</b>", subheading_style))
    elements.append(Paragraph(
        "Renata membaca algoritma unik Anda - pola perilaku, emosi, dan kebiasaan yang bahkan Anda sendiri "
        "tidak sadari. Kemudian, dengan izin Anda, Renata memberikan:",
        body_style
    ))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph(
        "✅ <b>Insight mendalam</b> tentang blind spots Anda",
        body_style
    ))
    elements.append(Paragraph(
        "✅ <b>Solusi actionable</b> yang spesifik untuk situasi Anda",
        body_style
    ))
    elements.append(Paragraph(
        "✅ <b>Prediksi pattern</b> yang bisa menghambat progress Anda",
        body_style
    ))
    elements.append(Paragraph(
        "✅ <b>Rekomendasi strategi</b> untuk mempercepat pencapaian tujuan",
        body_style
    ))
    elements.append(Paragraph(
        "✅ <b>Guidance yang personalized</b> - bukan advice generic",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))

    elements.append(Paragraph(
        "<b>Kenapa Ini Powerful?</b>",
        subheading_style
    ))
    elements.append(Paragraph(
        "Karena solusi yang diberikan adalah <b>di luar nalar manusia biasa</b>. AI dapat melihat korelasi "
        "dan pattern yang tidak terlihat oleh mata manusia. Ini seperti memiliki life coach, psychologist, "
        "dan strategist pribadi yang bekerja 24/7 untuk kesuksesan Anda.",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph(
        "💡 <i>Dengan Personal Analytics, hasil hidup Anda akan tercapai lebih cepat - "
        "kadang 5-10x lebih cepat dari yang Anda bayangkan!</i>",
        emphasis_style
    ))
    elements.append(PageBreak())

    # CALL TO ACTION
    elements.append(Paragraph("🚀 Saatnya Mengambil Keputusan Terbaik Hidup Anda", heading_style))
    elements.append(Spacer(1, 0.2*inch))

    elements.append(Paragraph(
        "Anda memiliki dua pilihan sekarang:",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))

    choice_data = [
        ['OPSI 1: FREE USER', 'OPSI 2: PRO MEMBER'],
        [
            '• Akses terbatas\n• Hanya basic features\n• Tidak ada Personal Analytics\n• Pertumbuhan lebih lambat\n• Hasil unpredictable',
            '• Full access semua fitur\n• Personal Analytics AI (Renata)\n• Priority support\n• Pertumbuhan accelerated\n• Hasil terukur & tercapai lebih cepat'
        ],
    ]

    t2 = Table(choice_data, colWidths=[3.5*inch, 3.5*inch])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.grey),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#1a237e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (0, 1), colors.lightgrey),
        ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#e3f2fd')),
        ('GRID', (0, 0), (-1, -1), 1.5, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(t2)
    elements.append(Spacer(1, 0.3*inch))

    elements.append(Paragraph(
        "<b>Pertanyaan yang Perlu Anda Tanyakan Pada Diri Sendiri:</b>",
        subheading_style
    ))
    elements.append(Paragraph("🤔 Apakah saya serius ingin berubah?", body_style))
    elements.append(Paragraph("🤔 Apakah saya ingin hasil yang maksimal atau sekadarnya?", body_style))
    elements.append(Paragraph("🤔 Apakah saya willing to invest in myself?", body_style))
    elements.append(Paragraph("🤔 Berapa nilai transformasi hidup saya?", body_style))
    elements.append(Spacer(1, 0.3*inch))

    elements.append(Paragraph(
        "<b>Investasi Terbaik adalah Investasi Pada Diri Sendiri</b>",
        emphasis_style
    ))
    elements.append(Paragraph(
        "PRO membership bukan expense - ini adalah investasi dengan ROI (Return on Investment) tertinggi. "
        "Ketika kecerdasan emosional dan intelektual Anda meningkat, SEMUA area kehidupan Anda otomatis "
        "membaik - karir, finansial, hubungan, kesehatan, dan kebahagiaan.",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph(
        "Ribuan member PRO kami telah membuktikan - ROI yang mereka dapatkan jauh melebihi investasi mereka. "
        "Dari promosi jabatan, bisnis yang profitable, hingga kehidupan keluarga yang harmonis.",
        body_style
    ))
    elements.append(Spacer(1, 0.3*inch))

    elements.append(Paragraph("✨ Your Best Life Awaits", heading_style))
    elements.append(Paragraph(
        "Selamat datang di eL Vision Group. Mari mulai perjalanan transformasi Anda hari ini. "
        "Versi terbaik dari diri Anda sedang menunggu untuk dimunculkan.",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph(
        "<b>Upgrade ke PRO sekarang dan rasakan perbedaannya!</b>",
        emphasis_style
    ))
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("---", body_style))
    elements.append(Paragraph("© 2025 eL Vision Group - Transform. Elevate. Thrive.", emphasis_style))

    # Build PDF
    doc.build(elements)
    print(f"✅ PDF '{pdf_filename}' berhasil dibuat!")
    return pdf_filename

if __name__ == "__main__":
    create_opening_pdf()
