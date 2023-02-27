import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { FullpageComponent } from './fullpage.component';

describe('FullpageComponent', () => {
  let component: FullpageComponent;
  let fixture: ComponentFixture<FullpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularFullpageModule],
      declarations: [FullpageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
