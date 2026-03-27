import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image, Font } from '@react-pdf/renderer';
import { FileText, Download } from 'lucide-react';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginBottom: 8,
    textTransform: 'uppercase',
    borderLeftWidth: 3,
    borderLeftColor: '#000',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#444',
  },
  value: {
    flex: 1,
  },
  content: {
    textAlign: 'justify',
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
  },
  signatureBox: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 5,
  }
});

// --- Clinical Summary PDF ---
const ClinicalSummaryPDF = ({ patient, notes }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ficha de Resumen Clínico</Text>
          <Text style={styles.subtitle}>Clínica de Rehabilitación "El camino del Guerrero y la Guerrera"</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={{ fontWeight: 'bold' }}>Folio: {patient.folio}</Text>
          <Text>Fecha: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* General Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos Generales</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre Completo:</Text>
          <Text style={styles.value}>{patient.nombre}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{patient.edad} años</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estatus:</Text>
          <Text style={styles.value}>{patient.estatus}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cama Asignada:</Text>
          <Text style={styles.value}>{patient.cama}</Text>
        </View>
      </View>

      {/* Medical Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnóstico Médico y Tratamiento</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Diagnóstico:</Text>
          <Text style={styles.value}>{patient.diagnostico || 'Pendiente de evaluación'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tratamiento:</Text>
          <Text style={styles.value}>{patient.tratamiento || 'Sin tratamiento asignado'}</Text>
        </View>
      </View>

      {/* Psychological Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evaluación Psicológica y Avances</Text>
        <Text style={styles.content}>
          {notes.filter((n: any) => n.tipo === 'Psicológica').map((n: any) => n.contenido).join('\n\n') || 
           'No se registran notas psicológicas recientes.'}
        </Text>
      </View>

      {/* Signatures */}
      <View style={styles.signatureContainer}>
        <View style={styles.signatureBox}>
          <Text style={{ fontWeight: 'bold' }}>Dra. Elena Martínez</Text>
          <Text>Médico Responsable</Text>
          <Text style={{ fontSize: 7 }}>Céd. Prof. 1234567</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={{ fontWeight: 'bold' }}>Lic. Roberto Gómez</Text>
          <Text>Psicólogo Clínico</Text>
          <Text style={{ fontSize: 7 }}>Céd. Prof. 7654321</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Este documento es confidencial y para uso exclusivo del personal de salud autorizado. 
        Cumple con la NOM-004-SSA3-2012 del expediente clínico.
      </Text>
    </Page>
  </Document>
);

// --- Incident Report PDF ---
const IncidentReportPDF = ({ logs }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reporte de Incidencias Operativas</Text>
          <Text style={styles.subtitle}>Bitácora de Seguridad y Vigilancia</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text>Fecha de Reporte: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registro de Eventos</Text>
        {logs.map((log: any, i: number) => (
          <View key={i} style={{ marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: '#eee', paddingBottom: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: 8 }}>
                [{log.nivel}] - {new Date(log.fecha).toLocaleString()}
              </Text>
              <Text style={{ fontSize: 8, color: '#666' }}>Monitor: {log.monitor}</Text>
            </View>
            <Text>{log.descripcion}</Text>
          </View>
        ))}
      </View>

      <View style={styles.signatureContainer}>
        <View style={styles.signatureBox}>
          <Text style={{ fontWeight: 'bold' }}>Monitor de Guardia</Text>
          <Text>Firma de Responsable</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={{ fontWeight: 'bold' }}>Dirección Operativa</Text>
          <Text>Sello y Firma</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Documento oficial de control interno. Prohibida su reproducción total o parcial sin autorización.
      </Text>
    </Page>
  </Document>
);

// --- Export Buttons ---
export const ExportClinicalSummary = ({ patient, notes }: any) => (
  <PDFDownloadLink
    document={<ClinicalSummaryPDF patient={patient} notes={notes} />}
    fileName={`Resumen_Clinico_${patient.folio}.pdf`}
    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
  >
    {({ loading }) => (
      <>
        <FileText className="w-4 h-4" />
        {loading ? 'Generando...' : 'Exportar Ficha PDF'}
      </>
    )}
  </PDFDownloadLink>
);

export const ExportIncidentReport = ({ logs }: any) => (
  <PDFDownloadLink
    document={<IncidentReportPDF logs={logs} />}
    fileName={`Reporte_Incidencias_${new Date().toISOString().split('T')[0]}.pdf`}
    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
  >
    {({ loading }) => (
      <>
        <Download className="w-4 h-4" />
        {loading ? 'Generando...' : 'Exportar Bitácora PDF'}
      </>
    )}
  </PDFDownloadLink>
);
