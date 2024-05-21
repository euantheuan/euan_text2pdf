import { Remarkable } from 'remarkable';
import html2pdf from 'html2pdf.js';

export const useExportToPDF = (markuptext) => {
    const exportPDF = () => {
        console.log(markuptext)
        const md = new Remarkable();
        const htmlContent = md.render(markuptext);
        console.log(htmlContent)
        const element = document.createElement('div');
        element.className = 'html_content';
        element.innerHTML = htmlContent;
        console.log(element);

        const options = {
            margin: [30, 25, 30, 25],
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 1 },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
        };

        return html2pdf()
            .from(element)
            .set(options)
            .toPdf()
            .output('blob')
            .then((pdfBlob) => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(pdfBlob);
                downloadLink.download = 'document.pdf';
                downloadLink.click();
                URL.revokeObjectURL(downloadLink.href);
                alert('파일을 저장했습니다.');
            })
            .catch((error) => {
                console.error('Error exporting PDF:', error);
                alert('오류가 발생했습니다.');
            });

    };

    return exportPDF;
};