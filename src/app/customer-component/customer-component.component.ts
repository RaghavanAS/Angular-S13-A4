import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { JsonPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CityService } from '../Services/City-Service';
import { Customer } from '../models/customer';
import { CustomerService } from '../Services/Customer-Service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-customer-component',
  templateUrl: './customer-component.component.html',
  styleUrls: ['./customer-component.component.css']
})
export class CustomerComponentComponent implements OnInit {
  // @Output() customerCreated: EventEmitter<Customer> = new EventEmitter<Customer>();
  // Citylist and CustomerList array
  cityList: string[] = [];
  customerList: Customer[] = [];
  // customer instance
  customer: Customer = new Customer();
  existingCustomer: Customer = new Customer();
  customerDetail: Customer;
  form: FormGroup;
  id: number;
  isNew: boolean;
  changesSaved: boolean;
  // constructor dependency injection
  constructor(
    private cityService: CityService,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router) {
    this.createForm();
  }
  // validating the form using formbuilder
  private createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose( [Validators.required, Validators.pattern('[A-Za-z]*')])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'),
      Validators.minLength(10), Validators.maxLength(10)])],
      email: ['', Validators.required],
      city: ['', Validators.required],
      DOB: ['', Validators.compose([Validators.required, Validators.pattern(
        '(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))'
      )])]
    });
  }
  // get the customer based on id and set the isNew flag
  ngOnInit() {
    this.route.params.subscribe(params => (this.id = +params['id']));
    const customer = this.customerService.getCustomer(this.id);
    if (customer) {
        Object.assign(this.customer, customer);
      } else {
        this.isNew = true;
      }
      // invoke the getCityList and getCustomerList methods
    this.cityList = this.cityService.getCityList();
    this.customerList = this.customerService.getCustomerList();
    Object.assign(this.existingCustomer, this.customer);
  }
  // store the new customer or update existing customer
  onSave(Values) {
    if (this.isNew) {
      this.customer.name = Values.name;
      this.customer.email = Values.email;
      this.customer.phone = Values.phone;
      this.customer.city = Values.city;
      this.customer.DOB = Values.DOB;
      this.customerService.storeCustomer(this.customer);
      this.customer = new Customer();
    } else {
      this.customerService.updateCustomer(this.id, this.customer);
    }
    // navigate to customers page on successful update or add
    this.changesSaved = true;
    this.router.navigate(['/customers']);
  }
  // handle unsaved changes by using canDeactivate auth gaurd
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      (this.customer.name !== this.existingCustomer.name ||
        this.customer.city !== this.existingCustomer.city ||
        this.customer.DOB !== this.existingCustomer.DOB ||
        this.customer.email !== this.existingCustomer.email ||
        this.customer.id !== this.existingCustomer.id ||
        this.customer.phone !== this.existingCustomer.phone ) &&
      !this.changesSaved
    ) {
      return confirm('Are you sure you don’t want to save the data ?');
    } else {
      return true;
    }
  }
}

