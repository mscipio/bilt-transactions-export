/**
 * CSV Module for generating transaction exports
 * Handles CSV formatting and data transformation
 */

(function() {
  'use strict';

  class CSVGenerator {
    /**
     * Generate CSV from transactions
     * @param {Array} transactions - Array of transaction objects
     * @param {Object} options - CSV generation options
     * @returns {string} CSV formatted string
     */
    static generate(transactions, options = {}) {
      const {
        headers = ['Date', 'Payee', 'Amount', 'Category', 'Memo'],
        dateFormat = 'YYYY-MM-DD',
        currencyFormat = 'USD'
      } = options;

      if (!transactions || transactions.length === 0) {
        return headers.join(',');
      }

      const rows = transactions.map(transaction => {
        return this.formatTransaction(transaction, headers);
      });

      return [headers.join(','), ...rows].join('\n');
    }

    /**
     * Format a single transaction as CSV row
     */
    static formatTransaction(transaction, headers) {
      return headers.map(header => {
        const key = header.toLowerCase();
        let value = transaction[key];

        // Handle different field mappings
        if (key === 'date') {
          value = transaction.date || '';
        } else if (key === 'payee' || key === 'description') {
          value = transaction.payee || transaction.description || '';
        } else if (key === 'amount') {
          value = this.formatAmount(transaction.amount);
        } else if (key === 'category') {
          value = transaction.category || '';
        } else if (key === 'memo' || key === 'notes') {
          value = transaction.memo || transaction.notes || '';
        } else if (key === 'currency') {
          value = transaction.currency || 'USD';
        }

        return this.escapeCSV(value);
      }).join(',');
    }

    /**
     * Format amount for CSV
     */
    static formatAmount(amount) {
      if (typeof amount === 'number') {
        return amount.toFixed(2);
      }
      return amount || '0.00';
    }

    /**
     * Escape CSV values properly
     */
    static escapeCSV(value) {
      if (value === null || value === undefined) {
        return '';
      }

      const str = String(value);
      
      // Check if escaping is needed
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        // Double up quotes and wrap in quotes
        return `"${str.replace(/"/g, '""')}"`;
      }

      return str;
    }

    /**
     * Download CSV as file
     * @param {string} csvContent - CSV formatted string
     * @param {string} filename - Desired filename
     */
    static download(csvContent, filename) {
      const blob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }

    /**
     * Parse CSV string back to transactions (for testing/import)
     */
    static parse(csvString) {
      const lines = csvString.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        return [];
      }

      const headers = this.parseCSVLine(lines[0]);
      const transactions = [];

      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        const transaction = {};

        headers.forEach((header, index) => {
          const key = header.toLowerCase().trim();
          const value = values[index] || '';

          if (key === 'date') {
            transaction.date = value;
          } else if (key === 'payee' || key === 'description') {
            transaction.payee = value;
          } else if (key === 'amount') {
            transaction.amount = parseFloat(value) || 0;
          } else if (key === 'category') {
            transaction.category = value;
          } else if (key === 'memo' || key === 'notes') {
            transaction.memo = value;
          } else {
            transaction[key] = value;
          }
        });

        transactions.push(transaction);
      }

      return transactions;
    }

    /**
     * Parse a single CSV line handling quoted values
     */
    static parseCSVLine(line) {
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            current += '"';
            i++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      values.push(current.trim());
      return values;
    }

    /**
     * Validate CSV format
     */
    static validate(csvString) {
      const lines = csvString.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        return { valid: false, error: 'Empty CSV' };
      }

      const headers = this.parseCSVLine(lines[0]);
      const requiredFields = ['date', 'payee', 'amount'];
      const headerNames = headers.map(h => h.toLowerCase().trim());

      const missingFields = requiredFields.filter(field => 
        !headerNames.includes(field) && !headerNames.includes('description')
      );

      if (missingFields.length > 0) {
        return { 
          valid: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        };
      }

      return { valid: true, headers: headerNames };
    }
  }

  // Expose to global scope
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVGenerator;
  } else {
    window.CSVGenerator = CSVGenerator;
  }
})();
